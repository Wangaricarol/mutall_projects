// 
//Resolve the baby/popup class used by the exploer window 
import * as outlook from "../../../outlook/v/code/outlook.js";
//
//Resolve references to the io
import * as io from "../../../outlook/v/code/io.js";
//
//Resolve mutall_error class
import * as schema from "./schema.js";
//
//To resolve the server methods
import * as server from "./server.js";
//To resole access to tge geral html
import * as app from "../../../outlook/v/code/app.js";
//Modeling various ways of viewing a node, notably tree and list views.
class node_view extends outlook.view {
    name;
    node;
    root;
    selector;
    hook;
    //
    //Class to manage nodes that are common to both tree and list viewa
    constructor(
    //
    //The name of this node
    name, 
    //
    //The node whose view is being considered
    node, 
    //
    //The element that contains all the sub-elements of a node in this view.
    root, 
    //
    //The selection element of a node. It is used for indexing this node, thus
    //bridging the gap between the view and this logical presentation of a node.
    //It is set during the construction of a class derived from this one
    selector, 
    //
    //The element where we will hook the root, i.e., that the root node will be a child 
    //of. In the case of tree view, this is the children element of the parent node. In
    //the case of list view, is is the tbody of the list view . The exact placement of
    //the root in the hook is determined by the node's anchor.
    hook) {
        //Initialize the outlook view
        super();
        this.name = name;
        this.node = node;
        this.root = root;
        this.selector = selector;
        this.hook = hook;
        //
        //Ensure that the view is visible.
        this.review();
    }
    //Returns the explorer of this node view
    get explorer() { return this.node.explorer; }
    //
    //Detach this view from its parent
    delete() {
        //
        //Every view has a root element; get its  parent
        const parent = this.root.parentNode;
        //
        //There must be a parent to the root element -- unless you are trying to delete the
        //root node
        if (parent === null)
            throw new schema.mutall_error(`The root element for node ${this.node.id} cannot be deleted`);
        //
        //Detach the root from the parent
        parent.removeChild(this.root);
    }
    //Reviewing a node means ensuring that the node is visible in its expected
    //place -- depending on the current view
    review() {
        //
        //Get the exact, i.e., primitive, anchorage of the node veing viewed
        const { placement, ref } = this.get_primitive_anchor();
        //
        //Effect the placement of the root element, following the anch specifications
        this.insert_or_append_element(placement, ref);
        //
        //Scroll the selector element into view
        this.selector.scrollIntoView();
    }
    //Returns how the node in this view is attached relative its
    //parent or sibblings
    get_primitive_anchor() {
        //
        //If the node has an anchor use it to formulate a primitive version
        if (this.node.anchor !== undefined) {
            //
            //Destructure the anchor to reveal placement and reference node specs.
            const { placement, reference } = this.node.anchor;
            //
            //Get the hook element of the reference node, depending on this view
            let ref;
            //
            //The reference element depends on the candidate node is placed
            switch (placement) {
                //
                //Appending is  specified in terms of where this  node will be hooked.
                case "append_child":
                    ref = reference[this.name].hook;
                    break;
                //
                //Insert before or after is specified in terms of siblings. 
                case "insert_after":
                case "insert_before": ref = reference[this.name].root;
            }
            //
            return { placement, ref };
        }
        //
        //If a node has no special placement, then it will be a child of some element
        const placement = "append_child";
        //
        //
        //If the node has a parent...
        if (this.node.parent !== undefined) {
            //
            //..then its reference is the root of the parent node
            const ref = this.hook;
            //
            //Return the primitive anchor
            return { placement, ref };
        }
        ;
        //
        //A root node, i.e., one that has no parent, is anchored to the tree
        //view element of the explorer
        //
        //If the tree panel is not yet defined, there must be a problem
        if (this.node.explorer.panel.tree === undefined)
            throw new schema.mutall_error('The tree element is not yet set');
        //
        //Get the explorer's tree view  element as teh reference
        const ref = this.node.explorer.panel[this.name];
        //
        //Return the anchor
        return { placement, ref };
    }
    //Insert the given candidate element before or after (or append as a child to) the referenced 
    //element
    insert_or_append_element(placement, ref) {
        //
        //Get teh candidate element that is being inserted. It is the root of this view.
        const candidate = this.root;
        //
        //
        //Insert or append the candidate node relative to a reference node
        switch (placement) {
            //
            //Append the candidate  to the reference element as a child
            case 'append_child':
                ref.appendChild(candidate);
                break;
            //
            //Insert the new new node as a sibbling    
            case 'insert_after':
            case 'insert_before':
                //
                //Get the parent of the reference
                const parent = ref.parentNode;
                //
                //It is an error if there is no parent
                if (parent === null)
                    throw new schema.mutall_error(`No parent found for node ${ref.id}`);
                //
                if (placement === 'insert_before')
                    //
                    //Place the root before the reference
                    parent.insertBefore(candidate, ref);
                else {
                    //
                    //Insert the root after the reference. There is no insertAfter() function. 
                    //So re-use insert before, using the next sibbling
                    //
                    //Get the next sibbling of the reference
                    const sibbling = ref.nextElementSibling;
                    //
                    //Append to the parent if there is no sibbling
                    if (sibbling === null)
                        //
                        //Append the root as a child of the parent
                        parent.appendChild(candidate);
                    //     
                    else //Place the root before the sibbling
                        parent.insertBefore(sibbling, candidate);
                }
                break;
        }
    }
    //Mark the node in this view as hovered on.
    mark_as_hovered() {
        //
        //Returns the explorer's panel elemnent, that matches this view
        const panel = this.node.explorer.panel[this.name];
        //
        //Ensure that this vie's selector is the only one marked as hovered on in 
        //the panel
        this.node.explorer.select(panel, this.selector, 'hovered');
    }
}
//Cass to support management of the list view elements and other associated 
//properties
class list_view extends node_view {
    list_table;
    //
    constructor(
    //
    //The node whose view is being considered
    node, 
    //
    //The list table that is being constructed
    list_table) {
        //
        //Create the root and hook  elements of a list view
        const { root, hook } = list_view.get_list_view_elements(node, list_table);
        //
        //Initialize the view named list. Note that the selector of a list view is the 
        //same as the root. 
        super('list', node, root, root, hook);
        this.list_table = list_table;
    }
    //Restore the list view selector, after aborting an update
    restore() {
        //
        //Selector is a tr. Get its tds and loop over each one of them
        Array.from(this.selector.cells).forEach(td => {
            //
            //Get the matching io
            const Io = io.io.get_io(td);
            //
            //Restore the io
            Io.restore();
        });
    }
    //Returns the table row for this view
    static get_list_view_elements(node, list_table) {
        //
        //Only nodes that have a parent are considerd
        if (node.parent === undefined)
            throw new schema.mutall_error('Only nodes that have a parent are considered');
        //
        //Get the parent tbody from the list table being constructed
        const tbody = list_table.tbody;
        //
        //Create a tr anchored in the body; remember to link it to this node
        //via an id and to the various interaction listeners.
        const tr = node.explorer.create_element("tr", tbody, {
            //
            //The node/list view link
            id: node.id,
            //
            //On clik, mark this node as selected in the list view, i.e., remove 
            //any selection from the list panel and select this node
            onclick: () => node.explorer.select(node.explorer.panel.list, tr),
            //
            //Select and open this node, if double clicked on
            ondblclick: () => {
                //
                //Show the children in the tree view
                node.tree.open();
                //
                //Select this node in the tree panel 
                node.explorer.select(node.explorer.panel.tree, node.tree.selector);
            },
            //
            //Select and perform a CRUD operation on this node and dont open 
            //the context menu
            oncontextmenu: async (evt) => {
                await node.crud();
                //
                //evt.stopPropagation();
                evt.preventDefault();
            },
            //
            //On hovering this node in the list view, mark it as hovered on, 
            //otherwise remove the hover
            onmouseover: () => { if (node.list !== undefined)
                node.list.selector.classList.add('hovered'); },
            onmouseout: () => { if (node.list !== undefined)
                node.list.selector.classList.remove('hovered'); }
        });
        //
        //By default, view this tr (row) in normal mode (as opposed to edit
        //mode)
        tr.classList.add('normal');
        //
        //There are as many row columns in the tr as there are header names. The header is derived
        //from the node that is the parent of this one
        list_table.names.forEach(name => {
            //
            //Create a table cell element, td
            const td = node.explorer.create_element("td", tr, {
                //
                //Mark the td as the only selected one in the list view (using a generalized
                // method impments in the view class)
                onclick: () => node.explorer.select(node.explorer.panel.list, td)
            });
            //
            //Create an io based on the content of this node, its property name, and the
            //current cell. The io is automatically saved in an indexed collection 
            //for further use.
            node.content.create_io(name, td);
        });
        //
        //Return the elements. The hook element of a list view is the tbody. It is where 
        //we hook the trs
        return { root: tr, hook: tbody };
    }
}
//Modelling that table that is used in a list view
class list_table extends outlook.view {
    node;
    //
    //The table elements
    table;
    thead;
    tbody;
    //
    //A collection that indexes the header column positions of the children 
    //table by position
    position_by_name;
    //
    //The names used as column headers
    names;
    //??
    selection;
    constructor(node) {
        super();
        this.node = node;
        //
        //Get the explo
        //
        //Create the table element
        this.table = this.create_element('table');
        //
        ///Create the tbody element
        this.tbody = this.create_element("tbody", this.table);
        //A. Create the header of the table
        //
        //Use the given node's content names to create a non-anchored list table.
        //
        //Add a header to the table
        this.thead = this.create_element("thead", this.table);
        //
        //Set the header column names. Let 'tagname' always be the first header
        this.names = ['tagname', ...this.node.content.get_header_names()];
        //
        //Create an map of (header) positions indexed by name
        this.position_by_name = new Map();
        //Paint the header names, and use them to index their relative positions
        this.names.forEach((name, position) => {
            //
            //Use the name to create the header
            this.create_element("th", this.thead, { textContent: name });
            //
            //Index the position by name
            this.position_by_name.set(name, position);
        });
        //
        //Paint the table's body
        this.paint_body();
    }
    //
    //Paint the body section of a list view, driven the children of teh current 
    //content
    paint_body() {
        //
        //Assume that the children of the node under review are set. It is an error
        //if this assumption is not met.
        if (this.node.children === undefined)
            throw new schema.mutall_error(`The children of the node must be set for this node to be listed`);
        //
        //Create an null table (matrix) with appropriate event listeners. It has
        //as many columns as the header names and as many table rows as there 
        //are children of this node. 
        this.node.children.forEach(child => child.list = new list_view(child, this));
        //
        //Fill the table matrix with values by looping through all the children 
        //of the nodes and completing each row
        this.node.children.forEach(async (child, rowIndex) => {
            //
            //Get the properties of the child
            const props = child.content.properties;
            //
            //Add the tagname of the child node
            props['tagname'] = child.content.name;
            // 
            //Loop through all the properties of the child as key/value pairs
            //and fill the mating td's
            for (const key in props) {
                //
                //Get the key value
                const value = props[key];
                //
                //Get the td that matches the property key. Remember to convert the
                //basic value of a key to a string.
                const cellIndex = this.position_by_name.get(String(key));
                //
                //If the cellIndex is not defined, something is wrong. Perhaps 
                //the column names do not match the data. You are probably using 
                //the wron header for the tabulating the children of this current
                //node
                if (cellIndex === undefined)
                    throw new schema.mutall_error(`Column ${key} is not among ${this.names}`);
                //
                //Set the value at the given cell and row indices
                //
                //Get the referenced td
                const td = this.table.rows[rowIndex].cells[cellIndex];
                //
                //Get the io associated with this cell
                const Io = io.io.collection.get(td);
                //
                //The io must exist, otherwise there is an issue
                if (Io === undefined)
                    throw new schema.mutall_error(`IO for ${key} not found`);
                //
                //Set the io's value
                Io.value = value;
            }
            ;
        });
    }
}
//Class to support management of the HTML tree view elements. It corresponds to the 
//following HTML fragment:-
/*
    <div class="root">
    <div class="header">
        <button class="expander" onclick="this.toggle('${this.name}')"
        >+</button>
        <div onclick="node.select(this) class='selector'>
            <img src="images/${this.icon}"/>
            <span>${this.name}</span>
        </div>
    </div>
    <div class="children hide">
        <!-- the children elements would be placed here when available -->
    </div>
</div>
*/
class tree_view extends node_view {
    //
    //The container for expander and selector
    header;
    //
    //The expander is the button/icon of a branch that shows if the branch is expanded
    //or contracted. It is also set when a node is created. A leaf node has no exepnder,
    //so its optional
    expander;
    //
    //The children element is  where all the child elements of this node
    //are anchored
    children;
    //
    //
    //Use the node whose view is being considered, to create this view
    constructor(node) {
        //
        //Get the elements of a tree view, so that some of them can be passed
        //to the parent (e.g., root selector and hook)
        const { root, selector, header, expander, children, hook } = tree_view.get_tree_view_elements(node);
        //
        //Initialize the node view named tree
        super('tree', node, root, selector, hook);
        //
        //Save the elements to this object
        this.header = header;
        this.expander = expander;
        this.children = children;
    }
    //Returns the elements of a tree view
    static get_tree_view_elements(node) {
        //
        //Get the parent node of the tree view. It is either the explore's tree panel, if this 
        //this is a root node, or the children element of this node's parent
        const hook = (node.parent === undefined) ? node.explorer.panel.tree : node.parent.tree.children;
        //
        //Use the div tag to create the root element without any anchoring. It is a div 
        //that serves no more purpose than containership and relative placement.
        const root = node.explorer.create_element('div', hook, { className: 'root' });
        //
        //Create the element to contain header components, such as the expander, icon, node name, etc
        const header = node.explorer.create_element("div", root, { className: 'header' });
        //
        //If this node is a branch add the expander button to the header. When clicked
        //on, it eithe opens or closes the children of the branch. In its initially 
        //closed because the children are not available yet. By clicking on the plus (+) the
        //children will be populated
        let expander = undefined;
        //
        if (node.content.is_branch())
            expander = node.explorer.create_element("button", header, {
                onclick: () => node.tree.toggle(),
                //
                //Start with the button in the uninitialized mode  
                textContent: "?"
            });
        //
        //Create the element that indicates the node's selection when clicked on. It 
        //should carry teh node id as well as the branch classification because its the
        //one that supports communication with user
        const selector = tree_view.create_selection_element(node, header);
        //
        //Create the children element anchored to the root element. By defaut 
        //it is hidden
        const children = node.explorer.create_element("div", root, {
            className: "children",
            hidden: true
        });
        //Compile and return all the tree elements
        return { root, selector, header, expander, children, hook };
    }
    //Add attributes to the tree view, anchored at the given selector element
    //(The method is static because it is called from a staic one)
    static add_attributes(explorer, properties, selector) {
        //
        //Use the explorer to create and anchor the options element.
        const options = explorer.create_element('div', selector, { className: 'options' });
        //
        //Loop through all the properties and attach each one of them as an option
        //of the options tag
        for (const key in properties) {
            //
            //Get teh value
            const value = properties[key];
            //
            //Create the option element as a child of options
            const option = explorer.create_element('div', options, { className: 'option' });
            //
            //Add the key span element
            explorer.create_element('span', option, { className: 'key', textContent: key });
            //
            //Add the key/value separator span tag
            explorer.create_element('span', option, { className: 'sep', textContent: ':' });
            //
            //Convert the value to a string
            let str = String(value);
            //
            //Truncate teh sring to 15 characters if necessary
            const max = 15;
            str = str.length > max ? str.substring(0, max - 1) + '…' : str;
            //
            //Add the value span tag. Limit value to 15 characters. 
            explorer.create_element('span', option, { className: 'value', textContent: str });
        }
        ;
    }
    //Toggling is about displaying the branch children (if they are hidden) or hiding
    //them if they are visible. In addition, the button's text content should change from
    //+ to - or vice versa
    toggle() {
        //
        //This operation is irrelevant for leaf nodes
        if (!this.node.content.is_branch())
            return;
        //
        //Make the children of this branch visible, if hidden; otherwise
        //hide them. That is what toggling is all about.
        if (this.children.hidden)
            this.open();
        else
            this.close();
    }
    //
    //Opening a branch does a number of things, including:-
    //1. Creating the chidren of this node, if necessary
    //2. Unhiding them
    //3. Changing the branch expander content to -, in readiness for contracting
    //the branch
    async open(selection) {
        //
        //Create/populate the children of this node if necessary. It is necessary 
        //if its children are undefined
        if (this.node.children === undefined) {
            //
            //Use the given selection to create this node's children
            this.node.children = await this.node.create_children(selection);
        }
        //
        //Unhide the children
        this.children.hidden = false;
        //
        //Change the expander to -, to indicate that all the children are 
        //visible
        if (this.expander !== undefined)
            this.expander.textContent = '-';
    }
    //
    //Closing a branch means 2 things:-
    //1. Hiding the children
    //2. Changing the branch expander content from to+
    close() {
        //
        //Hide the children of the branch
        this.children.hidden = true;
        //
        //Change the expander to + (or nothing if there are no children)
        const expander = this.node.children.length > 0 ? '+' : '-';
        //
        //Change the expander button content
        if (this.expander !== undefined)
            this.expander.textContent = expander;
    }
    //Create the element that indicates this node's selection when clicked on. It 
    //should carry the node id as well as the branch classification because its the
    //one that supports communication with user. It follows the following html
    //snipet:-
    /*
        <div id=$node.id class=branch|leaf onclick="node.select()>
            <checkbox><img src=$icon/><span>$node.name</span>$properties
        </div>
    */
    //The anchor of a leaf is tha same as that of the node. That of a branch is the 
    //the header
    static create_selection_element(node, anchor) {
        //
        //Create a div element, selector, anchored to the given one
        const selector = node.explorer.create_element("div", anchor, {
            //
            //The general identifier
            className: 'selector',
            //
            //When a selector element is clicked on:-
            //-it becomes the only one marked as selected
            //-(for a branch) the children are created, if necessary
            //-the list view is painted 
            onclick: () => { node.tree.select(); },
            //
            //When a selector is double clicked on in the tree view, it is both 
            //selected and opended
            ondblclick: () => { node.tree.select(); node.tree.open(); },
            //
            //CRUD this node, from a tree view
            oncontextmenu: async () => await node.crud(),
            //
            //On hovering this node in the tree view, mark it as hovered on
            onmouseover: () => node.tree.selector.classList.add('hovered'),
            onmouseout: () => node.tree.selector.classList.remove('hovered'),
            //
            //The identifier is key to retrieving this node from an indexed collection
            id: node.id
        });
        //Add (to the selector) the  multi-choice checkbox, if it is required
        if (node.explorer.is_multiple_choice) {
            //
            //Create a check box; teh user sets its sttais for whatever (temporary) 
            //reason
            node.explorer.create_element("input", selector, {
                type: 'checkbox',
            });
            //
        }
        //    
        //Add (to the selector) the icon as an image that matches the node
        node.explorer.create_element("img", selector, { src: node.content.get_icon() });
        //
        //Add ((to the selector) the node's friendly name
        node.explorer.create_element("span", selector, { textContent: node.content.name });
        //
        //Add the attributes, depending on the user requirements
        //
        //Get teh properties to be shown in the tree view
        const attributes = node.content.get_tree_view_attributes();
        //
        //Add them to the tree selector. Note that we are in a static method
        tree_view.add_attributes(node.explorer, attributes, selector);
        //
        //Return the selection element
        return selector;
    }
    //Highlights the selected node on the tree panel panel and update the list
    //view.
    async select() {
        //
        //Highlight this node in the tree view
        this.explorer.select(this.explorer.panel.tree, this.selector);
        //
        //Continue the selection only if this is a branch
        if (!this.node.content.is_branch())
            return;
        //
        //Set the children of the node, if necessary
        if (this.node.children === undefined)
            this.node.children = await this.node.create_children();
        //
        //Create a list panel that matches this node, from first principles 
        //and save the result for future paintings, if necessary.
        if (this.node.list_table === undefined)
            this.node.list_table = new list_table(this.node);
        //
        //Establish the link between this node's list view and the explorer
        //panel
        //
        //Get the explorer's list view panel
        const panel = this.explorer.panel.list;
        //
        //Clear the list by detaching all the current children
        Array.from(panel.children).forEach(child => panel.removeChild(child));
        //
        //Relink this node's table as to be a child of the explorer's panel.
        panel.appendChild(this.node.list_table.table);
    }
    //
    //The hook element of a tree view is the children element of the current node's tree view
    get_hook_element() {
        return this.node.parent.tree.children;
    }
}
//Node is a class for modelling hiererchical data. It represents the visible 
//aspect of such data (unlike content). It was made necessary by the fact
//that we cannot extend the XML element, so that we can add our own methods for
//for managing hierechical data. So we created our own that has similar 
//behaviour to an xml element but which we can extend in our own special ways
class node {
    content;
    explorer;
    parent;
    anchor;
    selection;
    //
    //The container for all the html elements that constitute the visible part 
    //of this node...
    //
    //...in the tree view. 
    tree;
    //
    //...in the list view. This is a table element that is initialized when a 
    //node is selected. Effectively it acts as a buffer to list view content, 
    //so that they don't always have to be created from first principals. The 
    //table has an associated collection of column positions indexed by 
    //their names, for use in filling up a table's body  
    list;
    //
    //A text identifier of a node, formed by prefixing the parents id with that of 
    //the current node that uniquely identifies a node independent of is content.
    //Hence the term univeral.It is used for indexing nodes
    get full_name() {
        //
        //Get the parent's id
        const pid = this.parent === undefined ? "" : this.parent.id;
        //
        //Return the id is the name of this node appended to the parent's id
        return `${pid}/${this.content.name}`;
    }
    //
    //The id of a node is an autogenerated string when a node is registered. It
    //is used for linking the tree and list views.
    id;
    //
    //The children of this node. They are set when a node is selected in the tree view, 
    //so that their properties can be shown in the list view. This is designed to be
    //consistent with the thinking around large data approach.
    children;
    //
    //A node has a list table that is set when the node is selected from the tree
    //view
    list_table;
    //
    constructor(
    //
    //The content to be tree viewed
    content, 
    //
    //The view that that is the home of the target element. This allows the
    //node class to access view-based functionality. It also must support
    //the management of nodes, including their creation, review, update and deletion.
    //In future, we could define specific interface for this purpose, but for now, 
    //tree panel will suffice.
    explorer, 
    //
    //The node that is the parent of this one; the root node's parent is undefined 
    parent, 
    //
    //The anchor details that show where this node will be placed relative
    //to some reference when it is created. It may be undefined. When this is the case, 
    //it will be appended as a child of the parent node. If a parent is undefined, then 
    //the node cannnot be anchored and any anhoring specification is an indicator of 
    //some logical error.
    anchor, 
    //
    //If a selection is specified, it helps to determine if this node
    //should be opened, i.e., filled up with children, or not
    selection) {
        this.content = content;
        this.explorer = explorer;
        this.parent = parent;
        this.anchor = anchor;
        this.selection = selection;
        //
        //Place this node in the logical view (i.e., not in the tree or list view) so that
        //this node becomes is now part of the parent's children. This is important for the 
        //parent node to know that this is one of of its children. If you dont do this, then
        //this new node will know its parent, but the parent wont know that this is one of
        //its children. THIS NEEDS SOME FURTHER THOUGHT, AS IT IS CONFLICTION
        //WITH THE DESIGN GOAL OF LOADING LARGE DATA, WHERE CHILDREN OF A PARENT 
        //NODE NEED NOT BE AVAILABLE UNTIL THE NODE IS SELECTED
        //
        //Create a tree view for this node
        this.tree = new tree_view(this);
        //
        //Add a list view if necessary. It is if the parent is defined and has
        //a list view
        if (parent !== undefined && parent.list_table !== undefined)
            this.list = new list_view(this, parent.list_table);
        //
        //Register this node in the explorer by adding it as node indexed by
        //its id
        this.id = explorer.register(this);
    }
    //
    //Use the selection to decide if the children should be painted or not
    async paint_in_tree_view() {
        //
        //2 Review the children, if necessary; 
        //
        //End the painting if there is no selection
        if (this.selection === undefined)
            return;
        //
        //Determine if we need to open his node or not
        //
        //Get the head selection item
        const head = this.selection[0];
        //
        //Continue only if this head item matches the content
        if (!(this.content.in_path(head)))
            return;
        //
        //Compose a new selection without the head, i.e., using the tail list.
        const selection = this.selection.slice();
        //
        //Open the node to reveal its children in the tree view.
        await this.tree.open(selection);
    }
    //Create and display the children nodes of this one in the logical model. 
    //The return /value is not critical, as it were. It is deliberately put here to 
    //ensure that we await for this synchronous to complete, wherever this
    //method is called.
    async create_children(selection) {
        //
        //Get the children contents of this node
        const contents = await this.content.get_children_content();
        //
        //Go through each child content and convert it to a node
        const children = contents.map(content => new node(
        //
        //The content of the child 
        content, 
        //
        //The explorer allows this node to access our library functionality
        this.explorer, 
        //
        //This branch becomes the parent of her children
        this, 
        //
        //Use the default anchoring, i.e., this is a child of the current branch.
        undefined, 
        //
        //Use the spliced selection guide the opening of the children
        selection));
        //
        return children;
    }
    //This method provides a user-interface for:- 
    // - creating a new one node a child or sibbling of this one
    // - updating the property values of this node
    // - deleting this node from the entire data management system.
    async crud() {
        //
        //Compile the crud operational choices 
        const choices = [
            { value: 'insert_before', name: 'Insert Sibling Before' },
            { value: 'insert_after', name: 'Insert Sibling After' },
            { value: 'append_child', name: 'Append Child' },
            { value: 'update', name: 'Update Node' },
            { value: 'delete', name: 'Delete Node' }
        ];
        //
        //Get the general html file
        const general_html = app.app.current.config.general;
        //
        //Create a popup for selecting the crud operation
        const popup = new outlook.choices(
        //
        //Use the general html template in outlook
        general_html, 
        //
        //Display the crud choices
        choices, 
        //
        //Use radio buttons for single selections 
        'single', 
        //
        //Name  these choices as 'operation'
        'operations');
        //
        //Get the CRUD operation
        const operation = await popup.administer();
        //
        //Discard the operation if we aborted the administration
        if (operation === undefined)
            return;
        //
        //Perform the requested operation to get a result. The result is either
        //ok or an error message.
        let result = undefined;
        //
        //Remember that choice administration returns a single or an
        //array of values -- depending the the choices type
        switch (operation) {
            //
            //These operation may require talking to the  server, so they are asynchronous
            case 'insert_before':
                result = await this.create('insert_before');
                break;
            case 'insert_after':
                result = await this.create('insert_after');
                break;
            case 'append_child':
                result = await this.create('append_child');
                break;
            case 'update':
                result = await this.update();
                break;
            case 'delete':
                result = await this.delete();
                break;
        }
        //
        //Report the error if the execution failed
        if (result instanceof schema.mutall_error) {
            alert(result.message);
        }
    }
    //Create, review and update a new node. We should be able to call
    //this method on a node, without having to go through the crud() user
    //interface. So, it is public
    async create(operation) {
        //
        //1. Create new (empty) content (using this node's content). NB. If you want
        //to create content without reference to a node, you can use the initial content
        //used to create the explorer, e.g., this.explorer.content.create_null_content() 
        const content = this.content.create_null_content();
        //
        //The placement of the new node will be made relative to this one
        const anchor = { placement: operation, reference: this };
        //
        //Use the null content to create the new node. The parent of this new
        //node is this one. The node will be immediately visible in the tree 
        //view. It will show in the list view when this node is selected
        new node(content, this.explorer, this, anchor);
        //
        return 'ok';
    }
    //
    //Use this node's content to update the node name in the tree view
    update_tree_view() {
        //
        //Get the node name
        const name = this.content.name;
        //
        //Get the span tag in the selector element of the tree view
        const span = this.tree.root.querySelector('span');
        //
        //It must exist
        if (span === null)
            throw new schema.mutall_error(`No span tag found in selector tag`);
        //
        //Update the contents of ths span tag
        span.textContent = name;
    }
    //Let the user supply input values to update this node and save the results.
    async update() {
        //
        //The updating takes place only in the list view, we assume this process 
        //was initiated when this node is in the list view. Conditune only if
        //this assumption is valid. It is if the list view of the node is defined
        if (this.list === undefined)
            throw new schema.mutall_error('The selected node must already be vsible in the list view');
        //
        //Get the tr associated with this node; it's the selector element of the 
        //list view
        const tr = this.list.selector;
        //
        //Remove/hide the nomal mode for the tr
        tr.classList.remove('normal');
        //
        //Put the tr in edit mode, so that the user can capture inputs
        tr.classList.add('edit');
        //
        //A. Display the go and cancel buttons and attach the appropriate  listeners
        //
        //Get the buttons
        const go = this.explorer.get_element('go');
        const cancel = this.explorer.get_element('cancel');
        //
        //Unhide the buttons
        go.hidden = false;
        cancel.hidden = false;
        //
        //Wait for the user to initiate saving of the result or to abort the update
        const save = await new Promise(resolve => {
            //
            //Clicking on the go button initiates a save operation
            go.onclick = () => resolve(true);
            //
            //Clicking on the cancel button initiates abortion
            cancel.onclick = () => resolve(false);
        });
        //
        //Prepare to return a result
        let result;
        //
        //Save the content or undo the button creation
        if (save) {
            result = await this.content.save(tr);
            //
            //Update the tr io
        }
        else {
            //
            //Restore the node's tree view. The list view must be set
            if (this.list === undefined)
                throw new schema.mutall_error(`The list view for node '${this.id}' is not set`);
            this.list.restore();
            //
            //Report back that this operation was aborted
            result = new Error('Update operation aborted');
        }
        //
        //Switch of both buttons and put back tr in normal mode
        go.hidden = true;
        cancel.hidden = true;
        tr.classList.remove('edit');
        tr.classList.add('normal');
        //
        //Return teh result
        return result;
    }
    //Delete this node from the content, tree and list views. We should be
    //able to execute this function programatically, i.e., without having to
    //goto through the crud() procedure. So, it is public
    async delete() {
        //
        //1. Delete the content of this node from the physical "database"
        const result = await this.content.delete();
        //
        //Abort the operation if deletion failed
        if (result instanceof schema.mutall_error)
            return result;
        //
        //Remove the node from memory
        this.undo();
        //
        //Success!
        return 'ok';
    }
    //Remove the node from memory
    undo() {
        //
        //1. Delete this node from the logical model 
        //
        //Get the parent of this node. If it is not defined, then this must be the
        //root node. It cannot be removed, otherwise the explorer becomes unusable. 
        if (this.parent === undefined)
            throw new schema.mutall_error(`The root node ${this.id} cannot be removed`);
        //
        //If the children of this node are not defined, then something is fishy 
        if (this.parent.children === undefined)
            throw new schema.mutall_error(`This node ${this.parent.id} has no children!`);
        //
        //Get the index of this node, from its parent's children
        const index = this.parent.children.indexOf(this);
        //
        //Remove one element at the index
        if (index > -1)
            this.parent.children.splice(index, 1);
        //
        //2. Delete this node from the nodes collection.
        if (!this.explorer.nodes_by_id.delete(this.id))
            throw new schema.mutall_error(`Node id ${this.id} failed to delete`);
        //
        //3. Remove this node from the tree view. 
        this.tree.delete();
        //
        //4. Remove from the list view
        this.list.delete();
    }
}
//Explorer is a general purpose page that uses tree and list views to manage, 
//i.e., Create, Review, Update and Delete (CRUD) hierarchical content. It is 
//designed to work with large amounts of data, so that branches for children 
//nodes are not available until required by the user. The page is designed to 
//return a selection if the user so desires; otherwise it is undefined
export class explorer extends outlook.baby {
    content;
    selection;
    is_select;
    is_branch;
    is_multiple_choice;
    //
    //The root node
    root;
    //
    //The Explorer page comprises of 2 panels that are set when this explorer is painted
    panel = { tree: undefined, list: undefined };
    //
    //Collection of nodes indexed an autogerenated id that is used for linking
    //nodes to the tree or list views
    nodes_by_id = new Map();
    //
    //The currently available id for labeling nodes uniquely. The number is 
    //autoincremented whenever a new node is registed in the collection
    available_id = 0;
    //
    constructor(
    //
    //The content that nwwes to be tree managed. 
    content, 
    //
    //The mother of this baby page
    mother, 
    //
    //The initial selection of content determines what the initial view of
    //the tree and list panels look like. The default is that the tree
    //comes out completely collapsed.
    selection = [], 
    //
    //Indicates if exploer was called to select a node, i.e., branch or leaf, or not. 
    //If true, the check method ensures that there is a selection before closing
    //the baby. The default is that explorer is called for browsing the tree only; 
    is_select = false, 
    //
    //Indicates if the expected selection is a leaf or a branch. The default is a branch. 
    //Note that this option is sensible only if is_select is true.
    is_branch = true, 
    //
    //Indicates if the exploer can be used for selection multiple choices or not.
    //The default is not
    is_multiple_choice = false) {
        //
        //The explorer template is part of teh shared files
        super(mother, "/schema/v/code/explorer.html");
        this.content = content;
        this.selection = selection;
        this.is_select = is_select;
        this.is_branch = is_branch;
        this.is_multiple_choice = is_multiple_choice;
    }
    //
    //Create and paint the tree view in this explorer's panel. The painting also expands
    //the tree to match the current selection, so that the selected part of the tree
    //view is apropriately expanded.
    async show_panels() {
        //
        //Get/set the tree panel element from the explorer template
        this.panel.tree = this.get_element("tree");
        //
        //Get/set the list panel element from the explorer template
        this.panel.list = this.get_element("list");
        //
        //Use this explorer's content to create the root node. Note: it has no 
        //parent, the anchorage are undefined and it shouuld be immediately 
        //visible from the tree view
        this.root = new node(this.content, this, undefined, undefined, this.selection);
        //
        //Expand the root node
        this.root.tree.open();
    }
    //
    //Register the requested node by adding it to the collection of nodes indexed by
    //an automaically generated id.The id is used for linking the the logical model
    //to the view in MVC parlance.
    register(node) {
        //
        //Get the current available id number
        const num = this.available_id;
        //
        //Prepare teh next available id
        this.available_id++;
        //
        //Formulate the id to a string that is suitable as an idenfier
        const id = `i${num}`;
        //
        //Index the node by its id to prepare for the frequent retrievals
        this.nodes_by_id.set(id, node);
        //
        //Return the id.
        return id;
    }
    //
    //The beviour of this method depends on 2 constructor arguments:is_select 
    //and is_file. See explorer constructor for details.
    async check() {
        //
        //If we are not doing a selection, then further action is not necessary
        if (!this.is_select)
            return true;
        //
        //Check if there is the requested (file or branch) selection in the 
        //list view. If there is, then  set the quiz result and leave the page
        if (this.selection_exists('list'))
            return true;
        //
        //Check if there is the requested (file or branch) selection in the 
        //tree view. If there is, then  set the quiz result and leave the 
        //page; otherwise leave the page open
        return (this.selection_exists('tree'));
    }
    //Returns the result of selection a node. This was set during the check method
    async get_result() {
        //
        //If we came for a selection then it must be defined
        if (this.is_select && this.result === undefined)
            throw new schema.mutall_error('The result of is not yet set');
        //
        return this.result;
    }
    //From the given anchor element, remove  all the current marked elements; 
    //then mark the target element. By default, the marking is 'selected', but the user
    //can override this, e.g., hovered.
    select(anchor, target, mark = 'selected') {
        //
        //Get all the marked element that are descendants of the anchor. 
        //Remember to add the leading dot (.)
        const selections = anchor.querySelectorAll(`.${mark}`);
        //
        //Remove all the marked elements
        Array.from(selections).forEach(selection => selection.classList.remove(mark));
        //
        //Mark the given target
        target.classList.add(mark);
    }
    //Check if there is a selection in the tree or branch panels -- depending
    //on the request. requested (file or branch) selection in the requested view. 
    //If there is, then set the quiz result and return true; otherwise it is false
    selection_exists(request) {
        //
        //Get the selection from the requested panel. 
        const selection = this.panel[request].querySelector(".selected");
        //
        //If there is a selection, in requested panel set the explores result to
        //the node'sselection;  there is no need for further tests
        if (selection !== null) {
            //
            //Set the explorer's  result property, to be returned when administration is over
            //
            //Use the selection element's id to retrieve the indexed node
            const node = this.nodes_by_id.get(selection.id);
            //
            //It is an error if the node is not found. Use the id to identify the node
            if (node === undefined)
                throw new schema.mutall_error(`Node '${selection.id}' not found in the nodes collection`);
            //
            //Set the result
            this.result = node.selection;
            //
            //Exit from this baby page succesfully
            return true;
        }
        //Otherwise return false
        return false;
    }
}
//
//The namespace that is shared by all technologies
export var common;
(function (common) {
    //Modelling the content to be managed using explorer. This is the home
    //for all methods that derived classes should implement 
    class content {
        name;
        properties;
        parent;
        //
        constructor(
        //
        //The name used as a tag in a tree view
        name, 
        //
        //The properties of this content
        properties, 
        //
        //The parent of this node. Root nodes have no parent
        parent) {
            this.name = name;
            this.properties = properties;
            this.parent = parent;
        }
        //Every node is assumed to be a branch, unless the user decides the 
        //contrary.
        is_branch() { return true; }
        ;
        //Tests if this content is in the path of the given selection head.
        in_path(head) {
            //
            //The node is in the path if we assume that the selection is specified
            //in terms of the node names, and the head item in the selection matches
            //the node name.
            return this.name === head;
        }
        //Returns the source of the icon that represents a branch and leaf images. The user can 
        //override the methods to define content-relevant images
        get_icon() {
            return this.is_branch()
                ? "/schema/v/code/folder.ico"
                : "/schema/v/code/file.ico";
        }
    }
    common.content = content;
})(common || (common = {}));
//The namespace for xml technology
export var xml;
(function (xml) {
    //Xml data is a natural candidate for tree viewing.
    class content extends common.content {
        element;
        //
        constructor(element, properties, parent) {
            //
            //Iniialize the common contemt element
            super(element.tagName, properties, parent);
            this.element = element;
        }
        //Returns the children of an element as an array of xml content.
        async get_children_content() {
            return Array.from(this.element.children).map(element => new child(element, this));
        }
        //Returns the io to be associated with an xml content. For now, every xml 
        //content is to be associated with with an exprt text field 
        create_io(cname, td) {
            return new io.input("text", td);
        }
        //A null xml content uses the owner document of this conteent to create
        //a new element with no name 
        create_null_content() {
            //
            return new child(this.element.ownerDocument.createElement('noname'), this);
        }
        //Deleting this xml content removes its element from dom
        async delete() {
            //
            //Detach this content;s element from DOM
            this.element.remove();
            //
            return 'ok';
        }
        //Returns the attribute names of this element to be displayed in a list
        //view
        get_header_names() {
            //
            //Collect all the attribute names of the children of the underlying
            //element
            const dirty_names = Array.from(this.collect_attribute_names());
            //
            //Clean the names
            const names = [...new Set(dirty_names)];
            //
            //Return the cleaned attributes
            return names;
        }
        //
        //
        //Collect all the aattribute names of this cncontent
        *collect_attribute_names() {
            //
            //Loop through all the children of the underlying element to collect 
            //the attributes
            for (const child of Array.from(this.element.children)) {
                //
                //Loop through all the attributes of the child to collect the
                //names
                for (let i = 0; i < child.attributes.length; i++) {
                    //Yield the attribute
                    yield child.attributes[i].name;
                }
            }
        }
        //Return the properties of this xml content. This data is used for driving the 
        //list view of an explorer. 
        static get_properties(element) {
            //
            //Start with an emyty list of key/value pairs
            const props = {};
            //
            //Loop through all the attributes of this contents element and
            //collect them as key value pairs
            //namee
            for (let i = 0; i < element.attributes.length; i++) {
                //
                //Get the key
                const key = element.attributes[i].name;
                //
                //get the value
                const value = element.attributes[i].value;
                //
                //Yield the attribute
                props[key] = value;
            }
            //
            //Return the pairs
            return props;
        }
        //By comparing the original and the values in the tr, write changes to the storage 
        //system
        async save(tr) {
            //
            //Loop through all the cells in the td, updating matching attribute in the 
            //underlying element if necessary
            for (const td of Array.from(tr.cells)) {
                //
                //Get the io that matches the td
                const Io = io.io.get_io(td);
                //
                //Get the column name
                const cname = td.dataset.cname;
                if (cname === undefined)
                    throw new schema.mutall_error(`This td has no column name`);
                //
                //Get the value to save
                const value_new = Io.value;
                //
                //Get the original value
                const value_old = this.element.getAttribute(cname);
                //
                //Update the named property if necessary
                if (this.value_has_changed(value_old, value_new)) {
                    //
                    //Change the new value to a string
                    const value = (value_new === null) ? '' : String(value_new);
                    //
                    this.element.setAttribute(cname, value);
                }
            }
            //
            //Indicate success
            return 'ok';
        }
        //Returns true if the old value is different from the new one
        value_has_changed(old_value, new_value) {
            //
            //Compare the values as strings; there is no change whenthe 2 are equal
            if (old_value === String(new_value))
                return false;
            //
            //Compare null and empty values, when there is no change
            if (old_value === '' && new_value === null)
                return false;
            //
            //The default is that the value has changed
            return true;
        }
        //All the properties of an exml contenmt are shown in the tree view
        //as atttributes
        get_tree_view_attributes() {
            return this.properties;
        }
    }
    //The root of an xml document
    class root extends content {
        //
        constructor(xml_str) {
            //
            //Get the xml dom document, that represents the data (MODEL) to be 
            //explored
            //Parse the input data, assumimg to be an xml string
            const parser = new DOMParser();
            //
            //Parse the input xml data
            const doc = parser.parseFromString(xml_str, "application/xml");
            //
            //Test if the parsing was succesful or not. If not successful, the 
            //document will contain a parsererror node. Hopefully the text content
            //of the node has the error message
            const error_node = doc.querySelector('parsererror');
            //
            //If parsing failed discontinue the show.
            if (error_node)
                throw new schema.mutall_error(`xml Parsing failed:${error_node.textContent}`);
            //
            //The document must have a root element, unless something went wrong
            if (doc.documentElement === null)
                throw new schema.mutall_error('Null xml is not expected');
            //
            //The root element has no properties and no parent
            super(doc.documentElement, {}, undefined);
        }
    }
    xml.root = root;
    class child extends content {
        constructor(element, 
        //
        parent) {
            //
            //Statically, get the properties of the given element
            const properties = content.get_properties(element);
            //
            //Inialize the common contemt element
            super(element, properties, parent);
        }
    }
    //
    //End of the xml namepace
})(xml || (xml = {}));
//The namespace for file system Technology
export var directory;
(function (directory) {
    //An Operating System directory (comprising of files and folders) is content 
    //that is fit for tree viewing. The fully specified path of slash seperated 
    //strings is used to represent a selection, i.e., file or folder
    class content extends common.content {
        name;
        properties;
        path;
        is_file;
        //
        //Directory data is presented in two paths. The root directory and the path
        //of the data relative to the root, so that the full path is that of the root
        //plus the relative one. In addition we need information whether this path
        //represents a file or folder
        constructor(
        //
        //The base name of this path
        name, 
        //
        //The properties of the path
        properties, 
        //
        //The full path name of the current directory entry 
        path, 
        //
        //Tells us if the path is a file or folder
        is_file, 
        //
        parent) {
            //Get the name to use for the directory
            //
            super(name, properties, parent);
            this.name = name;
            this.properties = properties;
            this.path = path;
            this.is_file = is_file;
        }
        //Returns the files and/or folders (as directory contemts) that are children 
        //of this folder through scanning. 
        async get_children_content() {
            //
            //Scan the current directory for file and folder entries. The reurned name
            //is the path of child entry, relative to the root 
            const scans = await server.exec(
            //
            //The class that supports management of directories on the server
            "path", 
            //
            //The file manager takes the 2 paremeters that define the current path:
            //The root and relative paths
            [this.path, this.is_file], 
            //
            //The directory operation that is required
            "scandir", 
            //
            //Scanning a directory has ho aruments
            []);
            //
            //Convert the raw scan to directories and return them
            return scans.map(scan => {
                //
                //Destructure the scan
                const { path, name, is_file, properties } = scan;
                //
                //Create a directory entry. 
                return new child(path, name, properties, is_file, this);
            });
        }
        //There are 4 header names associated with a direcrory 
        get_header_names() {
            return [
                //
                //Name of the folder or file. For files, it is filenam and extension. For
                //folders, its just the base name
                "name",
                //
                //The size of the folder or file in bytes
                "size",
                //
                //The creation date
                "create_date",
                //
                //The date of the last modification
                "modify_date"
            ];
        }
        //Only the a name file (in a directory namespace) is a modifiable text;
        //the rest of the properties are read-only
        create_io(cname, td) {
            //
            return cname === 'name' ? new io.input("text", td) : new io.readonly(td);
        }
        //Returns true current path is a folder, i.e., not a file
        is_branch() {
            return !this.is_file;
        }
        //Use this directory to create a new one
        create_null_content() {
            //
            //Let the name of the file/folder to be created be tmp
            const name = "tmp";
            //
            //Determine if we want to create a file or folder. For this version, only
            //folders can be created
            const is_file = false;
            //
            //Create a temporary file (in the root), whose name is tmp 
            //
            //The new directory shares the same root as this one. The root has no properties
            return new child(this.path, name, {}, is_file, this);
        }
        //No property of path is shown in the tree view as atttributes
        get_tree_view_attributes() {
            return {};
        }
    }
    //The special root node of a directory
    class root extends content {
        root;
        //
        constructor(
        //
        //The root path, beyond which browsing is not allowed.It corrrsppnds to the relative 
        //path of the child node
        root, 
        //
        //Tells us if the path is a file or folder
        is_file) {
            //Let teh name of the root path be a slash (/) and no properties
            super('/', {}, root, is_file);
            this.root = root;
        }
        //Delete the current folder or file from the server
        async delete() {
            throw new schema.mutall_error('The root node cannot be deleted');
        }
        //Rename the current file, if it exists, or cteate a new one
        async save(tr) {
            throw new schema.mutall_error('The root node cannot be edited, so cannot be saved');
        }
    }
    directory.root = root;
    //Content that has a parent
    class child extends content {
        constructor(
        //
        //The path of the current directory entry, relative to the root 
        path, 
        //
        //The base name of the path. (This could be obtained from the relative
        //path but 3rd party libraries are required to manipulate a path -- and
        //Im not familiar with them  
        name, 
        //
        //The properties of a child content
        properties, 
        //
        //Tells us if the path is a file or folder
        is_file, 
        //
        parent) {
            super(name, properties, path, is_file, parent);
        }
        //Returns the node name of this path
        get_name() {
            return this.name;
        }
        //Delete the current folder or file from the server
        async delete() {
            //
            //Execute delete on the server and return the result
            await server.exec(
            //
            //The class that supports management of directories on the server
            "path", 
            //
            //The file manager takes the 2 parameters that define the current path:
            //The root and relative paths
            [this.path, this.is_file], 
            //
            //The directory operation that is required
            "delete", 
            //
            //No nore data is required to specify a delete
            []);
            //
            //Rteurn ok if deleting was successful
            return 'ok';
        }
        //Rename the current file, if it exists, or cteate a new one
        async save(tr) {
            //
            //Only theh file/folder name property needs to be considered
            //Get it from the tr
            const td = tr.querySelector('td[data-name]');
            if (!(td instanceof HTMLTableCellElement))
                throw new schema.mutall_error('No td with found with data-name attribute');
            //
            //The name property must be present
            const value = io.io.get_io(td);
            //
            if (typeof (value) !== 'string')
                throw new schema.mutall_error('File/Folder name not found');
            //
            //Compare it with the past and return ok if not different
            if (value === this.name)
                return 'ok';
            //
            //Rename the current file or folder to the given value
            await server.exec('path', [this.path, this.is_file], 'rename', 
            //
            //Rename the current file to this one
            [value]);
            //
            //Return ok if successful
            return 'ok';
        }
    }
    directory.child = child;
})(directory || (directory = {}));
//The hierarchial records from a database table
export var record;
(function (record) {
    //This class is used for managing content (of data records obtained from a self looping
    //table) in a hierachical fashion. A selection can be represented by the primary
    //key of a desired record
    class content extends common.content {
        subject;
        fname;
        //
        //Define the frequent reference of a dbname/ename in sql, e.g., `user`.`mame`
        get ename() {
            const q = "`";
            return `${q}${this.subject.dbname}${q}.${q}${this.subject.ename}${q}`;
        }
        //
        //The datatabase that matches the subject dbname
        dbase;
        //
        //The metadata resulting from a record description 
        //The original sql used for formulating the query for isolating this record's children
        sql;
        //
        //The column names
        col_names;
        //
        //The maximum number of children for this record 
        max_records;
        constructor(
        //
        //The database and entity name from where this record is stored
        subject, 
        //
        //The tag or node name to be associated with this record
        name, 
        //
        //The record properties, Ifuel
        properties, 
        //
        //The field name to use for tagging this node's chilfren
        fname, 
        //
        //the parent content
        parent) {
            super(name, properties, parent);
            this.subject = subject;
            this.fname = fname;
        }
        //Use the editor query to return the  children of a primary key as all those 
        //records whose child_of field points to the key.
        async get_children_content() {
            //
            //Get the editor description.
            const metadata = await server.exec(
            //
            //The editor class is an sql object that was originaly designed 
            //to return rich content for driving the crud page.
            "editor", 
            //
            //Constructor args of an editor class are ename and dbname 
            //packed into a subject array in that order.
            [this.subject.ename, this.subject.dbname], 
            //
            //The method called to retrieve editor metadata on the editor class.
            "describe", 
            //
            //There are no describe method parameters
            []);
            //
            //Destructure the metadata
            const [idbase, col_names, sql_original, max_record] = metadata;
            //
            //Set the metadata properties
            this.dbase = new schema.database(idbase);
            this.sql = sql_original;
            this.col_names = col_names;
            this.max_records = parseInt(max_record);
            //
            //Formulate the child selection condition. Notice how the null
            //condition is formulated. Json extract function has a problem!
            const condition = this instanceof child ? `= ${this.pk}` : "='null'";
            //
            //Formulate the (local) sql for selecting children of the primary key 
            const local_sql = `select entry.* from (${sql_original}) as entry where entry.child_of->>"$[0]" ${condition}`;
            //
            //Execute the sql to get Ifuel,
            const ifuel = await server.exec(
            //
            //Use the database class to query
            "database", 
            //
            //Get the dbname, as the only database constructor argument
            [this.subject.dbname], 
            //
            //The method to execute
            "get_sql_data", 
            //
            //The sql argument of the method
            [local_sql]);
            //
            //Convert Ifuel to children
            return ifuel.map(fuel => new child(this.subject, fuel, this.fname, this));
        }
        //A record is a branch if it has children and there is no evidence 
        //to suggest otherwise
        is_branch() {
            // The default behaviour should be
            //that of a branch, unless teh evidence suggests otherwise
            //
            //An empty node is one pice of evidence of a leaf
            const empty = (this.max_records === 0);
            /*
            //There is some evidence that this is a leaf. There is if...
            const is_leaf =
                //
                //The column names are known...
                this.col_names!==undefined
                //
                //...and they include a field named leaf
                && this.col_names.includes('leaf')
            //
            return !(empty && is_leaf);
            */
            return !empty;
        }
        //Create an io based on the content of this node, its column name, and the
        //current cell (td). The io is automatically saved in an indexed collection 
        //that links the td with the io.
        create_io(cname, td) {
            //
            //Get the named column from the underlying database. 
            //Use the parent content as it is the one whose dbase is ready by now. 
            //It must be defined
            if (this.parent === undefined)
                throw new schema.mutall_error('Cannot create an io for a root content');
            //
            const col = this.parent.dbase.entities[this.subject.ename].columns[cname];
            //
            //Get and return the matching io using te io library
            return io.io.create_io(td, col);
        }
        //Create new (empty/null) record (using this node's record). NB. If you want
        //to create content without reference to a node, you can use the initial content
        //used to create the explorer, e.g., this.explorer.content.create_null_content() 
        create_null_content() {
            //
            //Define the shape of record's empty content
            let fuel = {};
            //
            //Use the header names of this content to build an empty structure
            for (const name of this.get_header_names()) {
                fuel[name] = null;
            }
            //
            //Create a new record, using  the null content and based on the same subject 
            //as this one. There is no current selection
            return new child(this.subject, fuel, this.fname);
        }
        //The root node cannot be deleted
        async delete() {
            throw new schema.mutall_error('Root node cannot be edited, so it cannot be deleted');
        }
        async save(tr) {
            throw new schema.mutall_error('Root node cannot be edited, so it cannot be saved');
        }
        //Returns the header column names of this node to be displayed in a list view.
        get_header_names() {
            return this.col_names;
        }
        //No property of record is shown in the tree view as atttributes
        get_tree_view_attributes() {
            return {};
        }
    }
    //The root content, i.e., content that has no parent
    class root extends content {
        constructor(subject, fname) {
            //
            //The root element has a slash name and no properties
            super(subject, '/', {}, fname);
        }
    }
    record.root = root;
    //A child content, i.e., content that has a parent 
    class child extends content {
        fuel;
        //
        //The primary key value of this record
        pk;
        //
        constructor(
        //
        //The database and entity name from which the primary key comes from
        subject, 
        //
        //The content of tabular data is represented by the record's properties
        //as fname/value pairs
        fuel, 
        //
        //The field to use as the tag name for the children of this node
        fname, 
        //
        //The parent content
        parent) {
            //
            //Get the entity name
            const ename = subject.ename;
            //
            //Get the friendly primary key column, as a json array string
            const json = String(fuel[ename]);
            //
            //Convert the json string to a friendly object
            const primarykey = JSON.parse(json);
            //
            //Get the tagname of this record; use the given fiel name to rettrieve it
            const name = String(fuel[fname]);
            //
            //Initialize the common content. 
            super(subject, name, fuel, fname, parent);
            this.fuel = fuel;
            //
            //Set the primary key value
            this.pk = primarykey[0];
        }
        //Delete this content from the storage system to return a crud result, indicating
        //success or failure
        async delete() {
            //
            //Get the primary key of the record to delete. Its key is named the same the
            //ename of this record
            const pk = this.fuel[this.subject.ename];
            //
            //Formulate the delete sql and ensure that the entity name is 
            //enclosed with back ticks.
            const ename_str = `\`${this.subject.ename}\``;
            const sql = `delete  from ${ename_str}  where ${ename_str}=${pk}`;
            //
            //Execute the delete query on the server and return the 
            //number of affected records.
            const records = await server.exec("database", [this.subject.dbname], "query", [sql]);
            //
            //Check if the delete was successful or not.
            return records === 1
                ? 'ok'
                : new schema.mutall_error(`The following query was not successful:${sql}`);
        }
    }
})(record || (record = {}));
