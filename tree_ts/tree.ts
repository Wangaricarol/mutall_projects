// 
//Resolve the baby/popup class used by the exploer window 
import * as outlook from "../../../outlook/v/code/outlook.js";
//
//Resolve references to the io
import * as io  from "../../../outlook/v/code/io.js";
//
//Resolve the layouts for saving
import * as quest from "./questionnaire.js";
//
//Resolve mutall_error class
import * as schema from "./schema.js";
//
//To resolve the server methods
import * as server from "./server.js";

//Resolve reference to ifuel
import * as lib from "./library.js";

// 
//Export the following classes from this module 

//Path is list of slash separated strings, e.g., d:/tracker/v/code/test.js. It is used
//for formulating a universal id for nodes -- regardless of content type
export type path = string;
//
//The shape of the data that can be used to specify is an array of identifiers that
//specify a path to tehe desired node. The root is equivalent to an empty list. \
//It is used for specifying:-
//- input: a desired tree view, e.g., when we initially open the tree
//- output: the desired output from a selection
export type selection = Array<string>;

// Subject of data management
interface subject {
    //
    //The name of the database where the data resides
    dbname: schema.dbname, 
    //
    //The name of the table where the data resides in teh database
    ename: schema.ename
}

//Modeling various ways of viewing a node, notably tree and list views.
abstract class node_view{
    //
    //Returns the name of a view
    abstract get name():string;
    //
    constructor(
        //
        //The node whose view is being considered
        public node:node,
        //
        //A HTML element that displays the children of th node in the a view. In the
        //list view, this is a tbody; in a tree view this children 
        public children:HTMLElement,
        //
        //A HTML element that represent this node in this view. In a list view
        //this is a tr; in a tree view it is a div.
        public root?:HTMLElement, 
    ){}


    //Returns the root element of the given node, depending on the view
    abstract get_root_element(node:node):HTMLElement;
    //
    //Returns the explorer's panel elemnent, depending on the view
    abstract get_panel_element():HTMLElement;
    //
    //Delete this view means detatching the root of of this view from its parent
    public delete(){
        //
        //Get the parent of this view's root element
        const parent = this.root!.parentNode; 
        //
        //There must be a parent to the root element
        if (parent===null)
            throw new schema.mutall_error(`The root element for node ${this.node.id} has no parent`);
        //
        //Detach the root from the parent
        parent.removeChild(this.root!);
    }

    //Reviewing a node  means ensuring that the node is vsible in its expected
    //place -- depending on the current view
    public review():void{
        //
        //Get the placement details, i.e., anchor.
        const {placement, ref} = this.get_anchor();
        //
        //Effect the placement of the root element
        this.insert_or_append_element(this.root!, placement, ref);
        //
        //Scroll the root element into voew
        this.root!.scrollIntoView();
    }

    //Returns how the node in this view is attached  relative its
    //parent or sibblings
    private get_anchor():{placement:insert_operation, ref:HTMLElement}{
        //
        //If the node has an anchor use it
        if (this.node.anchor !== undefined) {
            //
            //Destructure the anchor
            const{placement, reference} = this.node.anchor;
            //
            //Get the root element of the reference node, depending on this view
            const ref:HTMLElement = this.get_root_element(reference);
            //
            return {placement, ref};
        }
        //
        //If a node has no special placement, then it will be a child of some element
        const placement:insert_operation = "append_child";
        //
        //If the node has a parent
        if (this.node.parent!==undefined){
            //
            //Get the root  elenent of the parent node, depending on the view
            const ref:HTMLElement = this.get_root_element(this.node.parent)
            //
            //Return the anchor
            return {placement, ref};
        };
        //
        //When a node has no parent, then anchor it as a child of the
        //mater parent element, dependig on the view
        return {placement, ref:this.get_master_parent_element()}
    }

    //Returns the master parent element; it is the one to which the root is a child of, 
    //when a node has no parent.
    abstract get_master_parent_element():HTMLElement;

    //Insert the given candidate element before or after (or append as a child to) the referenced 
    //element
    private insert_or_append_element(candidate:HTMLElement, placement:insert_operation, ref:HTMLElement):void{
        //
        //Place the root relative to the reference
        switch(placement){
            //
            //Append the candidate  to the reference element as a child
            case 'append_child': ref.appendChild(candidate); break;
            //
            //Insert the new new node as a sibbling    
            case'insert_after':
            case 'insert_before':
                //
                //Get the parent of the reference
                const parent = ref.parentNode;
                //
                //It is an error if there is no parent
                if (parent === null) 
                    throw new schema.mutall_error(`No parent found for node ${ref.id}`);
                //
                if (placement ==='insert_before')
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

    //
    //Mark the node in the view as hovered on.
    mark_as_hovered():void{
        //
        //Get the selector element for this view
        const selector:HTMLElement = this.get_selector();
        //
        //Get the panel that matches this view
        const panel = this.get_panel_element();
        //
        //Ensure that it is the only one marked as hovered on
        this.node.explorer.select(panel, selector, 'hovered');
    }

    //Returns the selector elenent of this view -- depending on the view.
    //For a list view, the root element acts also as the selector. For
    //the tree view, it has a special element called so.
    abstract get_selector():HTMLElement;

}

//Manager for the list view elements and other associated priperties
class list_view extends node_view{
    //
    //The name of of a list view
    get name(){return 'list'; }
    //
    constructor(
        //
        //The node whose view is being considered
        node:node,
        //
        //The list table itself
        public list_table:list_table,
        //
        //A table row element that represents this node in the list view. This 
        //is optional because we set it only when the tr for the node is 
        //available
        public root?:HTMLTableRowElement, 
    ){
        //
        //The child elements of a list view are anchored in the tbody of its table 
        super(node, list_table.element.tBodies[0], root);
    }
    
    //The root element (in the list view) of the given node is provided can be accessed
    //directly from directly its list view
    get_root_element(node:node):HTMLElement{
        return node.list_view?.root!;
    }

    //Returns the tbody element attached to the list table in the
    //explorer
    get_panel_element():HTMLElement{
        return this.node.explorer.panel.list!;
    }

    //The selector element of a list view is the same as teh root
    get_selector():HTMLElement{
        return this.root!;
    }

    //Returns the element to which the root tr is a child of, when a 
    //node has no parent. It is the tbody of the list table defined at
    //the explorer  
    get_master_parent_element():HTMLElement{
        return this.node.explorer.list_table.element.tBodies[0];
    }

}

//Modelling that table that is used in a list view
class list_table{
    constructor(
        //
        //A HTML table that displays the children of a node in the list view
        public element:HTMLTableElement,
        
        //
        //A collection that indexes the header column positions of the children 
        //table by position
        public position_by_name:Map<string, number>,
         //
        //The names used as column headers
        public names:Array<string>, 
    ){}

}

//HTML tree view HTML elements
class tree_view extends node_view{
    //
    //The name of of a list view
    get name(){return 'tree'; }
    //
    //root, header, expander, children, selector
    constructor(
        //
        //The node whose view is being considered
        node:node,
        //
        //The element that contains all the sub-elements of a node. For a list view 
        //this is a table element
        root__:HTMLElement,
        //
        //The container for expander and selector
        public header:HTMLElement,
        //
        //The expander is the button/icon of a branch that shows if the branch is expanded
        //or contracted. It is also set when a node is created.
        //
        public expander:HTMLElement,
        //
        //The children element is is where all the child elements of this node
        //are anchored
        public children:HTMLElement,
        //
        //The selection element of a node. It is used for indexing this node, thus
        //bridging the gap between the view and this logical presentation of a node.
        //It is set during node painting
        public selector:HTMLElement
        
    ){
        super(node, children,  root__);
    }

    //
    //Returns the root element of this view as the children element becasuse 
    //thats where we will attach children (rows) in a tree view  
    get_root_element():HTMLElement{
        return this.children;
    }

    //Returns the element that serves as the tree view panel of explorer
    get_panel_element():HTMLElement{
        return this.node.explorer.panel.tree!;
    }

    //Returns the element to which the root is a child of, when a 
    //node has no parent. It is the tree view panel
    get_master_parent_element():HTMLElement{
        return this.get_panel_element();
    }

    //The selector element of a tree view is explicityly defined
    get_selector():HTMLElement{
        return this.selector;
    }
}


//Node insert operations
type insert_operation = 'insert_after'|'insert_before'|'append_child';

//CRUD operations around a reference node. Other operations, such as,  
//cut, copy, paste, and rename can be built from the CRUD ones;
type crud_operation= insert_operation|'update'|'delete';

//The anchor of an element dermines where it is placed (logically and visually) relative
//to a reference one. 
type anchor = {
    //
    //This is how the new node will be placed.... 
    placement:insert_operation,
    //
    //...relative this reference one 
    reference:node
};

//Node is a class for modelling hiererchical data. It was made necessary by the fact
//that we cannot extend the XML element, so that we can add our own methods for
//for managing hierechical data. So we created our own that has similar behaviour to
//an exl element but which we can extend in our own special ways
class node{
    //
    //The container for all the html elements that constitute the visible part 
    //of this node...
    //
    //...in the tree view. They are initialized when this node painted. This 
    //may require fetching children data from the server, so the process 
    //of filling them is asynchronous and therefore cannot be part of the 
    //constructor.
    public tree_view?:tree_view;
    //
    //...in the list view. This is a table element that is initialized when a 
    //node is selected. Effectively it acts as a buffer to list view content, 
    //so that they don't awlays have to be created from first principals. The 
    //table has an associated collection of column positions indexed by 
    //their names, for use in filling up a table's body  
    public list_view?:list_view;
    //
    //A text identifier of a node, formed by prefixing the parents id with that of 
    //the current node that uniquely identifies a node independent of is content.
    //Hence the term univeral.It is used for indexing nodes
    get full_name():path{
        //
        //Get the parent's id
        const pid = this.parent===undefined ? "": this.parent.id;
        //
        //Return the id is the name of this node appended to the parent's id
        return `${pid}/${this.name}` 
    }
    //
    //Every node must have a name; it is derived from its content
    public name:string;
    //
    //The id of a node is an autogenerated string when a node is registered. It
    //is used for linking the tree and list views.
    public id:string;
    //
    //The children of this node. They are set when a node is selected, so that 
    //their properties can be shown in the list view. This is designed to be
    //consistent with the thinking around large data approach.
    public children?:Array<node>;
    //
    constructor(
        //
        //The content to be tree viewed
        public content:content,
        //
        //The view that that is the home of the target element.This allows the
        //node class to access view-based functionality. It also must support
        //the management of nodes, including their creation, review, update and deletion.
        //In future, we could define specific interface for this purpose, but for now, 
        //tree panel will suffice.
        public explorer:explorer,
        //
        //The node that is the parent of this one; the root node's parent is undefined 
        public parent?: node,
        //
        //The anchor details that show where  this node will be placed relative
        //to some reference. It may be undefined. When this is the case, it will be appended
        //as a child of the parent. If a parent is undefined, then the node cannnot be anchored.
        //This means that there must be at least one node -- the root node -- in a tree view.
        public anchor?:anchor, 
        //
        //If a selection is specified, it helps to determine if this node
        //should be opened, i.e., filled up with children, or not
        public selection?:selection 
    ) {
        //
        //Use the content to set the name of this node
        this.name = content.get_name();
        //
        //Anchor this node to the logical model
        this.anchor_logically(anchor);
        //
        //Register this node in the explorer by adding it as node indexed by
        //its id
        this.id = explorer.register(this);
    }
    
    //
    //Anchor this node to the logical model, according to 3 scenarios
    private anchor_logically(anchor?:anchor):void{
        //
        //1. When anchoring data is available...
        if (anchor!==undefined){
            //
            //...the parent must also be available; otherwise something is wrong.
            if (this.parent===undefined) 
                throw new schema.mutall_error(`A parent for this node is expected`);
            //
            //Anchor this node as desired
            this.anchor_logically_definitely(anchor.placement, anchor.reference);
            //
            return;         
        }
        //
        //2. When there is no anchoring data and the parent is known
        if (this.parent!==undefined){
            //
            //Append this node to the parent as a child
            this.anchor_logically({placement:'append_child', reference:this.parent});
            //
            return;
        }
        //
        //3. When neither the anchoring nor the parent data is 
        //available: do nothing.     
    }
    //
    //Continue the anchoring when no placement data is definitely available. This 
    //process is similar to the one for inserting (or appending) HTML elements
    //except that we are deadling with an array for the logical case.
    private anchor_logically_definitely(placement:insert_operation, ref:node){
        //
        //Use the requested insert operation to decide how to place this
        //node relative to some reference, in the logical model
        switch(placement){
            //
            //Append this node as a child of the reference
            case 'append_child': 
                //
                //The children of the reference must be available. If not, the
                //request cannot be met. Inform the user.
                if (ref.children===undefined) 
                    throw new schema.mutall_error(`Unable to append ${this.id} because children of ${ref.id} are undefined`);
                //
                //Append this node to the reference as a child    
                ref.children.push(this); 
                break;
            //Insert this node after the reference
            case 'insert_before':
            case 'insert_after':
                //
                //Get the parent of the reference
                if (ref.parent===undefined)
                    throw new schema.mutall_error(`Unable to insert node ${this.id} as a sibbling of ${ref}; the parent of ${ref} is undefined`);
                //
                //Get the childer of the reference's parent    
                if (ref.parent.children===undefined) 
                    throw new schema.mutall_error(`Unable to append ${this.id} next to ${ref.id}; the childern of ${ref.parent.id} are undefined`);
                //    
                //
                //Get the position of the ref (amongds its sibblings)
                const index = ref.parent.children.indexOf(ref);
                //
                //The ref must be a child of the ref.parent
                if (index===-1)
                    throw new schema.mutall_error(`Unable to insert ${this.id} because node ${ref.id} is not a child of ${ref.parent.id}`);
                //
                //Get teh position where to inset this node
                const position = placement==='insert_before'?index:index+1;
                // 
                //Insert this node at the desired psoition
                ref.parent.children.splice(position, 0, this);
            break;    
        }
    }
        
    //
    //Paint this node in the tree view by creating a view, using it to review
    //the tree root element followed by creating and paiting her children (if necessary).
    public async paint_in_tree_view():Promise<void>{
        //
        //Create a tree view for this node
        this.tree_view = this.create_tree_view();
        //
        //1. Review the root element of this node in the tree view 
        this.tree_view.review() ;
        //
        //2 Review the children, if necessary; 
        //
        //End the painting if there is no selection
        if (this.selection===undefined) return;
        //
        //Determine if we need to open his node or not
        //
        //Get the head selection item
        const head = this.selection[0];
        //
        //Continue only if this head item matches the content
        if (!(this.content.in_path(head))) return;
        //
        //Compose a new selection without the head, i.e., using the tail list.
        const selection = this.selection.slice();
        //
        //Open the node to reveal its children.
        await this.open(selection);
        //
        //Select it. This will effectively paint the children in the list 
        //view
        this.select();
    }

    
    //
    //Paint/create the all the elements of a node. They match the following 
    //html fragment:-
    /*
     <div id="$path" class="branch">
        <div class="header">
            <button  
                onclick="branch.toggle('${this.name}')"
                class="btn">+</button>
            <div onclick="node.select(this)>
                <img src="images/${this.icon}"/>
                <span>${this.name}</span>
            </div>
        </div>
        <div class="children hide">
            <!-- the children elements would be placed here when available -->
        </div>
    </div>
    */
    private create_tree_view():tree_view{
        //
        //Use the div tag to create the root element without any annhoring. It is a div 
        //that serves no more purpose than containership and relative placement.
        const root = this.explorer.create_element('div');
        //
        //Create the branch header element to contain header components, such
        //as the expander, icon, node name, etc
        const header = this.explorer.create_element("div", root, {className:'header'});
            //
            //Add the expander button to the header. When clicked on, it eithe opens or
            //closes the children oof the branch. In its initially closed because
            //the children are not available yet. By cliking on the plus (+) the
            //children will be populated 
            const expander = this.explorer.create_element("button", header, {
                onclick:()=>this.toggle(),
                textContent:"+"
            });
            //
            //Create the element that indicates the node's selection when clicked on. It 
            //should carry teh node id as well as the branch classification because its the
            //one that supports communication with user
            const selector = this.create_selection_element(header);
        //
        //Create the children element anchored to the root element. By defaut 
        //it is hidden
        const children = this.explorer.create_element("div", root,{
            className:"children hidden"
        });
        //
        //Return the selection element (rather than the root) as this is the best 
        //representative of the node
        return new tree_view(this, root, header, expander, children, selector);
    }
    
    //Create the children nodes of this one in the logical model. The return
    //value is not critical, as it were. It is deliberately put here to 
    //ensure that we await for this synchronous to complete, wherever this
    //method is called.
    private async create_children(selection?:selection):Promise<Array<node>>{
        //
        //Start with an empty list of children. This ensures that new nodes can
        //be created and participate in teh logical model
        this.children = [];
        //
        //Get the children contents of this node
        const contents:Array<content> = await this.content.get_children_content();
        //
        //Go through each child contenty and convert it to a node
        contents.forEach(content=> new node(
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
            selection
        ));
        //
        return this.children;
    }
    //
    //Toggling is about displaying the branch children (if they are hidden) or hiding
    //them if they are visible. In addition, the button's text content should change from
    //+ to - or vice vers
    private toggle():void {
        //
        if (this.tree_view!.children.hidden) this.open(); else this.close()
    }
    //
    //Opening a branch does a number of things, including:-
    //1. Creating the chidren of this node, if necessary
    //2. Unhiding them
    //3. Changing the branch expander content to -, in readiness for contracting
    //the branch
    public async open(selection?:selection):Promise<void>{
        //
        //Create/populate the children of this node if necessary. No selection is 
        //required.
        if (this.children ===undefined) {
            //
            //Now use the given selection to create this node's children
            this.children = await this.create_children(selection);
        } 
        //
        //Unhide the children
        this.tree_view!.children.hidden = false;
        //
        //Change the expander to -, to indicate that all the children are 
        //vsible
        this.tree_view!.expander.textContent = '-';
    }

    //
    //Closing a branch means 2 things:-
    //1. Hiding the children
    //2. Changing the branch expander content from to+
    private close():void{
        //
        //Hide the children of the branch
        this.tree_view!.children.hidden = true;
        //
        //Change the expander to +
        this.tree_view!.expander.textContent = '+';
    }

    //Highlights the selected node on the tree panel panel and update the list
    //view.
    public select() {
        //
        //1. Remove any selection from the tree panel and select this node
        this.explorer.select(this.explorer.panel.tree!, this.tree_view!.selector);
        //
        //2. Paint the children of this node in the list view (without opening the children
        //in the tree view).
        this.paint_children_in_list_view();
    }

    //Paint the children of this node in the list view. This method is 
    //called by select(). It constructs the children nodes of this one, if 
    //necessary, and paints them in the list view. A list view is designed 
    //to display the properties of all the children in a tabular fashion.
    private async paint_children_in_list_view():Promise<void>{
        //
        //Determine if we need to create the list view from first principles or not
        if (this.list_view ===undefined){
            //
            //Create a list panel that matches this node, from first principles 
            //and save the result for future paintings.
            this.list_view = await this.create_list_view();
        }else{
            //
            //Re-establish the link between this node's list view and the explorer
            //panel
            //
            //Get the explorer's list view panel
            const panel:HTMLElement =  this.explorer.panel.list!;
            //
            //Clear the list by detaching all the current children
            Array.from(panel.children).forEach(child => panel.removeChild(child));
            //
            //Relink this node's list element as a child to that of the explorer.
            panel.appendChild(this.list_view.root!);
        }
    }

    //Create a completed list view (comprising of the children of this node and their
    //properties) in tabular fashion and return a list view for this node.
    private async create_list_view():Promise<list_view>{
        //
        //1. Create an empty-body list table using this nodes's column names
        const list_table = this.explorer.create_table(this.content.get_header_names());
        //
        //The body rows are based on the children of this node. They must be known by now
        if (this.children===undefined) 
            throw new schema.mutall_error(`Node ${this.id}'s children are not set`);
        //
        //Create an null table (matrix) with appropriate event listeners. It has
        //as many table rows as there are children of this node. 
        this.children.forEach(child=>{
            //
            //Create a ready, i.e., completely filled in and wired, tr
            const tr = child.create_child_row(list_table);
            //
            //Let the tr be the root of the child node, in the list view
            child.list_view!.root = tr;
        });
        //
        //2. Fill the table matrix with values
        //
        //Loop through all the children of this branch and fill the matching table rows
        //with values
        this.children.forEach(async(child, rowIndex)=>{
            //
            //Get the properries of the child
            const props = await child.content.get_properties(); 
            // 
            //Loop through all the properties of the child as key/value pairs
            props.forEach(({key, value})=>{
                //
                //Get the td that matches the property key
                const cellIndex = list_table.position_by_name.get(key);
                //
                //Is an error if the index cannot be found
                if (cellIndex===undefined)
                    throw new schema.mutall_error(`Property name ${key} is not found in the index`)
                //
                //Set the value at the given cell and row indices
                //
                //Get the referenced td
                const td = list_table.element.rows[rowIndex].cells[cellIndex]
                //
                //Get the io associated with this cell
                const Io = io.io.collection.get(td); 
                //
                //The io must exist
                if (Io===undefined) throw new schema.mutall_error(`IO for ${key} not found`);
                //
                //Set the io's value
                Io.value = value; 
            });
        });
        //
        //Get the root of this node in teh list view. It is the tr of....
        //Return the table as the list anchor
        return new list_view(this, list_table);
    }

    //Create a child table row for this node, given the list table
    public create_child_row(list_table:list_table):HTMLTableRowElement{
        //
        //Get the parent tbody element
        const tbody = list_table.element.tBodies[0];
        //
        //Create a tr anchored in the body; remember to link it to this node
        //via an id and to the various interaction listeners.
        const tr:HTMLTableRowElement = this.explorer.create_element("tr", tbody, {
            //
            //The node/list view link
            id:this.id,
            //
            //Select this node, to review her children in the list view. Note the
            //difference with the double click. The children are not visible
            onclick: ()=>this.select(),
            //
            //Select and open this node
            ondblclick:()=>{
                //
                //Show the children in the tree view
                this.open();
                //
                //Show the children in the list view 
                this.select(); 
            },
            //
            //Perform CRUD operations on this node
            oncontextmenu: async()=>await this.crud(),
            //
            //On hovering this node in the list view, ensure that the matching node on the
            //tree view is also hovered on.
            onmouseover:()=> this.tree_view?.mark_as_hovered()
        });
        //
        //There are as many row columns as there are header names
        list_table.names.forEach(name=>{
            //
            //Create a table cell element, td
            const td:HTMLTableCellElement = this.explorer.create_element("td", tr, {
                //
                //Mark the td as the only selected one in the list view (using a generalized
                // method impments in the view class)
                onclick: ()=>this.explorer.select(this.explorer.panel.list!, td)
            });
            //
            //Create an io based on the content of this node, its property name, and the
            //current cell. The io is automatically saved in an indexed collection 
            //for further use.
            this.content.create_io(name, td);
        });
        //
        //Return the table row
        return tr;
    }    

        
    //Create the element that indicates this node's selection when clicked on. It 
    //should carry the node id as well as the branch classification because its the
    //one that supports communication with user. It follows the following html
    //snipet:-
    /*
        <div id=$node.id class=branch|leaf onclick="node.select()>
            <checkbox><img src=$icon/><span>$node.name</span>
        </div>
    */
    //The anchor of a leaf is tha same as that of the node. That of a branch is the 
    //the header
    private create_selection_element(anchor:HTMLElement):HTMLElement{
        //
        //Create a div element, selector,  anchodered to the given one
        const selector = this.explorer.create_element("div", anchor, {
            //
            //When a selector element is clicked on:-
            //-it becomes the only one marked as selected
            //-(for a branch) the children are created, if necessary
            //-the list view is painted 
            onclick:()=>this.select(),
            //
            //When a selector is double clicked on, what heppend depends on the view:-
            //???
            ondblclick:()=>{this.select(); this.open();},
            //
            //CRUD this node, from a tree view
            oncontextmenu: async ()=>await this.crud(),
            //
            //On hovering this node in the tree view, ensure that the matching node on the
            //list  view is also hovered on.
            onmouseover:()=> this.list_view?.mark_as_hovered(),
            //
            //The identifier is key to retrieving this node from an indexed collection
            id:this.id
        });
        //Add (to the selector) the  multi-choice checkbox, if it is required
        if (this.explorer.is_multiple_choice){
            //
            //Create a check box; teh user sets its sttais for whatever (temporary) 
            //reason
            this.explorer.create_element("input", selector, { 
                type:'checkbox',
            });
            //
        }
        //    
        //Add (to the selector) the icon as an image that matches the node
        this.explorer.create_element("img", selector, { src: this.content.get_icon()});
        //
        //Add ((to the selector) the node's friendly name
        this.explorer.create_element("span", selector, {textContent: this.name});
        //
        //
        //Rteurn the selection element
        return selector;
    }

    
    //This method provides a user-interface for:- 
    // - creating a new one node a child or sibbling of this one
    // - updating the property values of this node
    // - deleting this node from the entire data management system.
    public async crud():Promise<void>{
        //
        //Compile the crud operational choices 
        const choices:Array<outlook.key_value<crud_operation>> = [
            {key:'insert_before', value:'Insert a new Node Before the Current one'},
            {key:'insert_after', value:'Insert a new Node After the Current one'},
            {key:'append_child', value:'Append a new Node as a Child of the Current one'},
            {key:'update', value:'Update the propeties of this Node'},
            {key:'delete', value:'Delete this Node'}
        ];
        //
        //Create a popup for selecting the crud operation
        const popup = new outlook.choices<crud_operation>(
            //
            //Use the general html template in outlook
            'outlook/v/code/general.html',
            //
            //Display the crud choices
            choices, 
            //
            //Name  these choices as operation
            'operations', 
            //
            //Use the default window size/location specs
            undefined, 
            //
            //and anchor the choices  to the (default) content element of the 
            //general template
            undefined, 
            //
            //Use radio buttons for single selections 
            'single'
        );
        //
        //Get the CRUD operation
        const operation = await popup.administer();
        //
        //Discard the operation if we aborted the administration
        if (operation ===undefined) return;
        //
        //Perform the requested operation to get a result. The rfesult is either
        //ok or an error message.
        let result:lib.crud_result;
        //
        //Remember that choice administration returns an array of choices. For single
        //choice cases, only one operation is expected    
        switch(operation[0]){
            //
            //These operation may require talking to the  server, so they are asynchronous
            case 'insert_before': result =  await this.create('insert_before'); break;
            case 'insert_after': result =  await this.create('insert_after'); break;
            case 'append_child': result =  await this.create('append_child'); break;
            case 'update': result = await this.update(); break;
            case 'delete': result = await this.delete(); break;
        }   
        //
        //Report the error if the execution failed
        if (result instanceof schema.mutall_error){
            alert(result.message);
        }
    }

    //Create, review and update a new node. We should be able to call
    //this method on a node, without having to go through the crud() user
    //interface. So, it is public
    public async create(operation:insert_operation):Promise<lib.crud_result>{
        //
        //1. Create new (empty) content (using this node's content). NB. If you want
        //to create content without reference to a node, you can use the initial content
        //used to create the explorer, e.g., this.explorer.content.create_null_content() 
        const content = this.content.create_null_content();
        //
        //The placement of the new node will be made relative to this one
        const anchor = {placement:operation, reference:this};
        //
        //Use the null content to create the new node. 
        const Node = new node(content, this.explorer, this, anchor);
        //
        //2. Review tey node
        //
        //Create a tree view for this  node
        Node.tree_view = Node.create_tree_view();
        //
        //Review the node in the tree view
        Node.tree_view.review();
        //
        //Create a list view for this node
        Node.list_view = await Node.create_list_view();
        //
        //Review the node in the list view, so that we can access its properties
        //for subsequent editing. 
        Node.list_view.review();
        //
        //3. Update the node to get some new content
        const result = await Node.update();
        //
        //Update the node in the tree view. The user may have suggested a better name than 
        //the default name1
        if (result==='ok') this.update_tree_view();
        //
        return result;
    }

    //
    //Use this node's content to update the node name in the tree view
    private update_tree_view():void{
        //
        //Get the node name
        const name = this.content.get_name();
        //
        //Get the span tag in the selector element of the tree view
        const span = this.tree_view!.root!.querySelector('span');
        //
        //It must exist
        if (span===null) 
            throw new schema.mutall_error(`No span tag found in selector tag`);
        //
        //Update the contents of ths span tag
        span.textContent = name;     
    }
        
    
    //Let the user supply input values to update this node and save the results.
    //We should be able to execute this function programatically, i.e., without 
    //having to goto through the crud() user interface. So, it is public
    async update():Promise<lib.crud_result>{
        //
        //The updating takes place only in the list view, we assume this process was 
        //initiated when this node is in the list view.
        //Get the tr associated with this node; its the root of the list view
        const tr = this.list_view!.root!;
        //
        //Put the tr in edit mode, and let user capture inputs
        tr.classList.add('edit');
        //
        //Add a cotainer for save and cancel buttons as the last td in the tr
        const td = this.explorer.create_element('td', tr);
        //
        //Wait for the user to initiate saving of the result or to abort the update
        const save:boolean = await new Promise(resolve=>{
            //
            //Add a save button this last container
            this.explorer.create_element('button', td, {
                value:'Save',
                onclick:()=>resolve(true)
            });
            //
            //Add a cancel button to the container
            this.explorer.create_element('button', td, {
                value:'Cancel',
                onclick:()=>resolve(false)
            });
        });
        //Remove the save/cancel container
        tr.removeChild(td);
        //
        //Save the content or undo the button creation
        if (save) return await this.content.save(tr);
        //
        //Undo the creation of the new node 
        this.undo();
        //
        //Report back that this operation was aborted
        return new schema.mutall_error('Operation aborted');
            
    } 

    //Delete this node from the content, tree and list views. We should be
    //able to execute this function programatically, i.e., without having to
    //goto through the crud() procedure. So, it is public
    public async delete():Promise<lib.crud_result>{
        //
        //1. Delete the contentof this node from the physical "database"
        const result:lib.crud_result = await this.content.delete();
        //
        //Abort the operation if deletion failed
        if  (result instanceof schema.mutall_error) return result;
        //
        //Remove the node from memory
        this.undo();
        //
        //Success!
        return 'ok';
    }
   
    //Remove the node from memory
    private undo():void{
        //
        //1. Delete this node from the logical model 
        //
        //Get the parent of this node. If it is not defined, then this must be the
        //root node. It cannot be removed, otherwise the explorer becomes unusable. 
        if (this.parent===undefined) 
            throw new schema.mutall_error(`The root node ${this.id} cannot be removed`);
        //
        //If the children of this node are not defined, then something is fishy 
        if (this.parent.children===undefined) 
            throw new schema.mutall_error(`This node ${this.parent.id} has no children!`);
        //
        //Get the index of this node, from its parent's children
        const index = this.parent.children.indexOf(this);
        //
        //Remove one element at the index
        if (index > -1) this.parent.children.splice(index, 1);
        //
        //2. Delete this node from the nodes collection.
        if (!this.explorer.nodes_by_id.delete(this.id))
            throw new schema.mutall_error(`Node id ${this.id} failed to delete`);
        //
        //3. Remove this node from the tree view. 
        this.tree_view!.delete();
        //
        //4. Remove from the list view
        this.list_view!.delete();
    }
    
}


//Explorer is a general purpose page that uses tree and list views to manage, 
//i.e., Create, Review, Update and Delete (CRUD) hierarchical content. It is 
//designed to work with large amounts of data, so that branches for children nodes
//are not available until required by the user.
export class explorer extends outlook.baby<selection>{
    //
    //The Explorer page comprises of 2 panels that are set when this explorer is painted
    public panel:{
        //
        //The tree panel is marked by a any element to which we can hook a tree structure 
        //that helps users to navigate the hierararchies of some content
        tree?:HTMLElement,
        //
        //The list view panel is any element where we can hook a table that can display
        //display the properties of this node's children in a tabular fashion
        list?:HTMLElement
    } = {tree:undefined, list:undefined}
    //
    //Collection of nodes indexed an autogerenated id that is used for linking
    //nodes to the tree or list views
    public nodes_by_id:Map<path, node> = new Map();
    //
    //The currently available id for labeling nodes uniquely. The number is 
    //autoincremented whenever a new node is registed in the collection
    public available_id:number=0; 
    //
    //
    //The list table  that serves as the home of nodes in the list view that 
    //don't have a parent.
    public list_table:list_table;
    
    //
    constructor(
        //
        //The children contents that dont have a parent. 
        public root_children:Array<node>,
        //
        //The mother of this baby page
        mother:outlook.page,
        //
        //The initial selection of content determines what the initial view of
        //the tree and list panels look like. The default is that the tree
        //comes out completely collapsed.
        public selection:selection=[],
        //
        //Indicates if exploer was called to select a node, i.e., branch or leaf, or not. 
        //If true, the check method ensures that there is a selection before closing
        //the baby. The default is that explorer is called for browsing the tree only; 
        public is_select=false,
        //
        //Indicates if the expected selection is a leaf or a branch. The default is a branch. 
        //Note that this option is sensible only if is_select is true.
        public is_branch = true,
        //
        //Indicates if the exploer can be used for selection multiple choices or not.
        //The default is not
        public is_multiple_choice:boolean = false
    ){
        //
        //The explorer template has 2 key anchors thant reprent tree and list
        //views
        super(mother,  "explorer.html");
        //
        //Construct the list table that serves as the home of nodes that don't have 
        //a parent. 
        this.list_table = this.create_table(['/']);
    }
    
    //
    //Use the given column header names to create a non-anchored list table.
    public create_table(names:Array<string>):list_table{
        //
        //Create an anchorless table
        const element = this.create_element('table');
        //
        //A. Create the header of the table
        //
        //Add a thead to the table
        const thead = this.create_element("thead", element);
        //
        //Create an map of (header) positions indexed by name
        const position_by_name:Map<string, number> = new Map();
        //
        //Paint the names, and use them to index their relative positions
        names.forEach((name, position)=>{
            //
            //Use the name to create the header
            this.create_element("th", thead, {textContent:name});
            //
            //Index the position by name
            position_by_name.set(name, position);
        });
        //
        //
        //B.Create the empty list view body
        this.create_element("tbody", element);
        //
        //Return the table
        return new list_table(element, position_by_name, names);
    }
    
    //
    //Create and paint the tree view in this explorer's panel. The panting also expands
    //the tree to match the current selection, so that the selected part of the tree
    //view is apropriately expandded.
    async show_panels(){
        //
        //Get/set the tree panel element from the explorer template
        this.panel.tree = this.get_element("tree");
        //
        //Get/set the list panel element from the explorer template
        this.panel.list = this.get_element("list");
        //
        //Paint the root childrenn in the tree view, thus making it visible.
        this.root_children.forEach(child=>child.paint_in_tree_view());
    }
    
    //
    //Register the requested node by adding it to the collection of nodes indexed by
    //an automaically generated id.The id is used for linking the the logical model
    //to the view in MVC parlance.
    register(node:node):string {
        //
        //Get the current available id number
        const num:number = this.available_id;
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
    //The beviour of this method depends on 2 constructor arguments:is_select and is_file. See
    //explorer constructor for details.
    async check():Promise<boolean>{
        //
        //If we are not doing a selection, then further action are not necessary
        if (!this.is_select) return true;
        //
        //Check if there is the requested (file or branch) selection in the list view. 
        //If there is, then  set the quiz result and leave the page
        if (this.selection_exists('list')) return true;

        //Check if there is the requested (file or branch) selection in the tree view. 
        //If there is, then  set the quiz result and leave the page; otherwise leave the
        //page open
        return (this.selection_exists('tree'));
    }

    //Returns the result of selection a node. This was set during the check method
    async get_result():Promise<selection>{
        //
        //Throw an exption if teh result is not set yet
        if (this.result===undefined)
            throw new schema.mutall_error('The result of is not yet set');
        //
        return this.result;    
    }

    //From the given anchor element, remove  all the current selections; then mark the 
    // target element as selected. By default, the marking is 'selected', but the user
    //can overide this, e.g., hovered.
    select(anchor:HTMLElement, target:HTMLElement, value:string='selected'){
        //
        //Get all the selections thar are descendants of the anchor
        const selections = anchor.querySelectorAll('.selected');
        //
        //Remove the aelected attribute
        Array.from(selections).forEach(selection=>selection.classList.remove('selected'));
        //
        //Add the given value to the class list
        target.classList.add(value);
    }

    //Check if there is a selection in the tree or branch panels -- depending
    //on the request. requested (file or branch) selection in the requested view. 
    //If there is, then set the quiz result and return true; otherwise it is false
    selection_exists(request:'list'|'tree'):boolean{
        //
        //Get the selection from the requested panel. 
        const selection = this.panel[request]!.querySelector(".selected");
        //
        //If there is a selection, in requested panel set the explores result to
        //the node'sselection;  there is no need for further tests
        if (selection!==null){
            //
            //Set the explorer's  result property, to be returned when administration is over
            //
            //Use the selection element's id to retrieve the indexed node
            const node = this.nodes_by_id.get(selection.id);
            //
            //It is an error if the node is not found. Use the id to identify the node
            if (node ===undefined) 
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




//Modelling the content to be managed using explorer. This is the home
//for all methods that derived classes should implement 
export abstract class content{
    //
    //For now, not sure  what should be known about content at construction
    //time
    constructor(){}

    //Determine if this content is a branch or not. If not, then it must be a leaf
    abstract is_branch():boolean;

    //Tests if this content is in the path of the given selection head.
    in_path(head:string):boolean{
        //
        //The node is in the path if we assume that the selection is specified
        //in terms of the node names, and the head item in the selection matches
        //the node name.
        return this.get_name() === head;
    }

    //Returns the contents of the children of of a branch content. For instance: the
    //content of /tracker/v/code are all the files and folders that are children subfolders
    //of this path, e.g., /tracker/v/code/main.ts
    abstract get_children_content():Promise<Array<content>>;

    //Returns the name of some content.For instance, given the content, /tracker/c/code, the
    //name is  content.. Givem <test id='1'></test>, the name is test.
    abstract get_name():string;

    //Returns the source of the icon that represents a branch and leaf images. The user can 
    //override the methods to define content-relevant images
    get_icon():path{
        return this.is_branch() ? "images/branch.ico":"images/leaf.ico";   
    }

    //Return the properties of this content as key/value pairs. This data is used 
    //for driving the list view of an explorer. You may need to get the serfer to help:hence
    //the promoise 
    abstract get_properties():Promise<Array<{key:string, value:string}>>;
    
    //Returns the header column names of this node to be displayed in a list view.
    abstract get_header_names():Array<string>;
    
    //Delete this content from the storage system return a crud result, indicating
    //success or failure
    abstract delete():Promise<lib.crud_result>;
    
    //Create an io based on the content of this node, its property name, and the
    //current cell. The io is automatically saved in an indexed collection 
    //for further use.
    abstract create_io(cname:string, td:HTMLTableCellElement):io.io;
    
    //Create new (empty/null) content (using this node's content). NB. If you want
    //to create content without reference to a node, you can use the initial content
    //used to create the exlorer, e.g., this.explorer.content.create_null_content() 
    abstract create_null_content():content;
        
    //By comparing the original and the values in the tr, write changes to the storage 
    //system
    abstract save(tr:HTMLTableRowElement):Promise<lib.crud_result>; 
}


//Xml data is a natural candidate for tree viewing. A selection from the
//tree can be specified as an array of node names
export class xml extends content{
    //
    constructor(public element:Element){
        //
        super();
    }

    //Returns all the child elements of the root element, of the given xml
    //string
    static get_root_children(xml_str:string):Array<xml>{
        //
        //Get the xml dom document, that represents the data (MODEL) to be 
        //explored
        
        //Parse the input data, assumimg to be an xml string
        const parser = new DOMParser();
        //
        //Parse the input xml data
        const doc = parser.parseFromString(xml_str,  "application/xml");
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
        if (doc.documentElement === null) throw new schema.mutall_error('Null xml is not expected');
        //
        //Get the children of the root element and convert them to xml content
        return Array.from(doc.documentElement.children).map(child=>new xml(child));        
    }
    
    //An XML element is a branch if it has children 
    is_branch():boolean{
        //
        return this.element.children.length>0;
    }

    //Returns the children of an element as an array of xml content.
    async get_children_content():Promise<Array<xml>>{
        return Array.from(this.element.children).map(child=>new xml(child));
    }
    
    //Returns the tag name of the xml element
    get_name():string{ return this.element.tagName; }

    //Returns the io to be associated with an xml content. For now, every xml 
    //content is to be associated with with an exprt text field 
    create_io(cname:string, td:HTMLTableCellElement):io.io{
        return new io.input("text",td);
    }

    //A null xml content uses the owner document of this conteent to create
    //a new element with no name 
    create_null_content(): xml {
        //
        return new xml(this.element.ownerDocument.createElement('noname'));
    }

    //Deleting this xml content removes its element from dom
    async delete(): Promise<lib.crud_result> {
        //
        //Detach this content;s element from DOM
        this.element.remove();
        //
        return 'ok';
    }

    //Returns the attribute names of this element to be displayed in a list
    //view
    get_header_names():Array<string>{
        //
        //Collect all the attribute names of the children of the underlying
        //element
        const dirty_names:Array<string> = Array.from(this.collect_attribute_names())
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
    private *collect_attribute_names():Generator<string>{
        //
        //Loop through all the children of the underlying element to collect 
        //the attributes
        for(const child of Array.from(this.element.children)){
            //
            //Loop through all the attributes of the child to collect the
            //names
            for (let i=0; i++; i<child.attributes.length){
                //
                //Yield the attribute
                yield child.attributes[i].name;
            }
        }
    }

    //Return the properties of this xml content as key/value pairs. This data is used 
    //for driving the list view of an explorer. 
    async get_properties():Promise<Array<{key:string, value:string}>>{
        //
        //Start with an emyty list of key/value pairs
        const pairs:Array<{key:string, value:string}> = [];

        //
        //Loop through all the attributes of this contemts element and
        //collect them as key value pairs
        //namee
        for (let i=0; i++; i<this.element.attributes.length){
            //
            //Get the key
            const key = this.element.attributes[i].name;
            //
            //get the value
            const value = this.element.attributes[i].value;
            //
            //Yield the attribute
            pairs.push({key, value});
        }
        //
        //Return the pairs
        return pairs;
    }

    //By comparing the original and the values in the tr, write changes to the storage 
    //system
    async save(tr:HTMLTableRowElement):Promise<lib.crud_result>{
        //
        //Loop through all the cells in the td, updating matching attribute in the 
        //underlying element if necessary
        for(const td of Array.from(tr.cells)){
            //
            //Get the io that matches the td
            const Io = io.io.get_io(td);
            //
            //Get the column name
            const cname = td.dataset.cname;
            if (cname===undefined)
                throw new schema.mutall_error(`This td has no column name`);
            //
            //Get the value to save
            const value_new:lib.basic_value = Io.value;
            //
            //Get the original value
            const value_old:string|null = this.element.getAttribute(cname);
            //
            //Update the named property if necessary
            if (this.value_has_changed(value_old, value_new)) {
                //
                //Change the new value to a string
                const value:string = (value_new===null) ? '': String(value_new);
                //
                this.element.setAttribute(cname, value);
            }
        }
        //
        //Indicate success
        return 'ok';
    }

    //Returns true if the old value is different from the new one
    private value_has_changed(old_value:string|null, new_value:lib.basic_value):boolean{
        //
        //Compare the values as strings; there is no change whenthe 2 are equal
        if (old_value === String(new_value)) return false;
        //
        //Compare null and empty values, when there is no change
        if (old_value==='' && new_value===null) return false;
        //
        //The default is that the value has changed
        return true;
    }
    
}

//An Operating System directory (comprising of files and folders) is content 
//that is fit for tree viewing. The fully specified path of slash seperated 
//strings is used to represent a selection, i.e., file or folder
export class directory extends content{
    //
    //Directory data is presented in two paths. The root directory and the path
    //of the data relative to the root, so that the full path is that of the root
    //plus the relative one. In addition we need information whether this path
    //represents a file or folder
    constructor(
        //
        //The root path, beyond which browsing is not allowed.
        public root:path,
        //
        //The path of the current directory entry, relative to the root 
        public relative:path,
        //
        //The base name of the path. (This could be obtained from the relative
        //path but 3rd party libraries are required to manipulate a path -- and
        //Im not familiar with them  
        public name:string,
        //
        //Tells us if the path is a file or folder
        public is_file:boolean
    ){
        super();
    }
    //Returns all the files and or folders that are children
    //of the given path
    static async get_root_children(path:string, is_file:boolean):Promise<Array<directory>>{
        //
        //A file has no children
        if (is_file) return [];
        //
        //Get the children of the given path. Use the given path to fomulate a 
        //directory. The base name of the path ...requires a 3rd party library
        //to exctract the base name. Its not important, so put a ?
        const dir = new directory(path, "", "?", false);
        //
        return await dir.get_children_content();
    }
    

    //There are 4 header names associated with a direcrory 
    get_header_names(): Array<string> {
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
        ]
    }

    //Only a file is a modifiable text; the rest of the properties are
    //read-only
    create_io(cname: string, td: HTMLTableCellElement): io.io {
        //
        return cname==='name' ? new io.input("text",td): new io.readonly(td);
    }

    //Use this directory to create a new one
    create_null_content(): directory {
        //
        //Let the name of the file/folder to be created be tmp
        const name = "tmp";
        //
        //Determine if we want to create a file or folder. Fpr this version, only
        //folders can be created
        const is_file = false;
        //
        //Create a temporary file (in teh root), whose name is tmp 
        //
        //The new directory shares the same root as this one
        return new directory(this.root, this.relative, name, is_file)
    }

    //Returns the files and/or folders (as directory contemts) that are children 
    //of this folder through scanning. 
    async get_children_content():Promise<Array<directory>>{
        //
        //Scan the current directory for file and folder entries. The reurned name
        //is the path of child entry, relative to the root 
        const scans: Array<{relative:path, name:string, is_file:boolean}> = await server.exec(
            //
            //The class that supports management of directories on the server
            "path",
            //
            //The file manager takes the 2 paremeters that define the current path:
            //The root and relative paths
            [this.root, this.relative, this.is_file],
            //
            //The directory operation that is required
            "scandir",
            //
            //Scanning a directory has ho aruments
            [] 
        );
        //
        //Convert the raw scan to directories and return them
        return scans.map(scan=>{
            //
            //Destructure the scan
            const {relative, name, is_file} = scan;
           //
           //Create a directory entry
           return new directory(this.root, relative, name, is_file);
        });
    }

    //Returns true current path is a folder, i.e., not a file
    is_branch(): boolean {
        return !this.is_file;
    } 

    //Returns the node name of this path
    get_name(): string {
        return this.name;
    } 

    //Delete the current folder or file from the server
    async delete(): Promise<lib.crud_result> {
        //
        //Execute delete on the server and return the result
        await server.exec(
            //
            //The class that supports management of directories on the server
            "path",
            //
            //The file manager takes the 2 parameters that define the current path:
            //The root and relative paths
            [this.root, this.relative, this.is_file],
            //
            //The directory operation that is required
            "delete",
            //
            //No nore data is required to specify a delete
            [] 
        );
        //
        //Rteurn ok if deleting was successful
        return 'ok';
    }

    //Return the properties of a file or folder
    async get_properties(): Promise<Array<{ key: string; value: string; }>> {
        //
        //Get the properties from the server
        const props = await server.exec(
            //
            //Address the directory manager
            'path',
            //
            //A directory is defines by 2 paths
            [this.root, this.relative, this.is_file],
            //
            //Call the get properties method
            'get_properties',
            //
            []
        );
        //
        //Add the name (for which we dont need the server) and return them
        return [{key:'name', value:this.name}, ...props];
    }
    
    //Rename the current file, i+if it exists, or cteate a new one
    async save(tr: HTMLTableRowElement): Promise<lib.crud_result> {
        //
        //Only theh file/folder name property needs to be considered
        //Get it from the tr
        const td = tr.querySelector('td[data-name]');
        if (!(td instanceof HTMLTableCellElement)) throw new schema.mutall_error('No td with found with data-name attribute');
        //
        //The name property must be present
        const value = io.io.get_io(td);
        //
        if (typeof(value) !=='string') throw new schema.mutall_error('File/Folder name not found');
        //
        //Compare it with the past and return ok if not different
        if (value === this.name) return 'ok';
        //
        //Rename the current file or folder to the given value
        await server.exec(
            'path',
            [this.root, this.relative, this.is_file],
            'rename',
            //
            //Rename the current file to this one
            [value]
        );
        //
        //Return ok if successful
        return 'ok';

    }

}

//This class is used for managing records data obtained from a self looping
//table in a hierachical fashion. A selection can be represented by the primary
//key of a desired record
export class record extends content{
    //
    //Define the frequent reference of a dbname/ename in sql, e.g., `user`.`mame`
    get ename(){ 
        const q="`";
        return `${q}${this.subject.dbname}${q}.${q}${this.subject.ename}${q}`;
    }
    //
    //The datatabase that matches the subject dbname
    public dbase?:schema.database;
    //
    //The metadata resulting from a record description 
    //The original sql used for formulating the query for isolating this record's children
    sql?:string; 
    //
    //The column names
    col_names?:Array<string>;
    //
    //The maximum nyumber of children 
    max_records?:number;
    //
    constructor(
        //
        //The content of tabular data is represented by the record's properties
        //as fname/value pairs
        public content:{[index:string]:lib.basic_value},
        //
        //The database and entity name from which the primary key comes from
        public subject:subject,
        //
        //The current selection 
        public pk?:number
    ){
        super();
    }

    //Returns all the records that don't have a parent
    static async get_root_children(subject: subject):Promise<Array<record>>{
        //
        //Formulate the sql for selecting all the entitis that dont have a parent
        const sql= `
            select
                ${subject.ename}.*
            from
                ${subject.dbname}.${subject.ename}
            where
                child_of is null
        `;
        //
        //Execute the sql
        const rows: lib.Ifuel = await server.exec(
            "database",
            [subject.dbname],
            'get_sql_data',
            [sql]
        );
        //
        //Convert the ifuel records to content records, and return them
        return rows.map(row=>new record(row, subject));
    }
    
    //Use the editor query to return the  children of a primary key as all those 
    //records whose child_of field points to the key.
    async get_children_content():Promise<Array<record>>{
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
            []
        );
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
        //Formulate the (local) sql for selecting children of the primary key 
        const local_sql = `select entry.* from (${sql_original}) as entry where entry child_of->>"$.pk" = ${this.pk}`;
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
            [local_sql]
        );
        //
        //Convert Ifuel to children
        return ifuel.map(fuel=>new record(fuel, this.subject));       
    }

    //Returns the tag name of a recrord. This the friendly name of a selector that 
    //matches this record
    get_name():string{ 
        //
        //Get the name of the primary key column; its the same as that of the entity
        const pkname = this.subject.ename;
        //
        //Get the composite primary key column, as a json string
        const json = this.content[pkname];
        //
        //test if jsoin is a string
        if (typeof json !== 'string') 
            throw new schema.mutall_error(`The primary key of ${pkname} should be a string`);
        //
        const obj:{pk:number, friend:string} = JSON.parse(json);
        //
        //Get the friendly component, from the context
        return obj.friend;               
    }

    //A record is a branch if it has no children children and there is no evudence to suggest
    //otherwise
    is_branch(): boolean {
        //
        return (this.max_records!==0) && !this.col_names!.includes('branch')
    }  
    
    //Create an io based on the content of this node, its column name, and the
    //current cell (td). The io is automatically saved in an indexed collection 
    //this link thd td with the io.
    create_io(cname:string, td:HTMLTableCellElement):io.io{
        //
        //Get the named column from the underlying database
        const col  = this.dbase!.entities[this.subject.ename].columns[cname];
        //
        //Get and return the matching io using te io library
        return io.io.create_io(td, col);
    }

    //Create new (empty/null) record (using this node's record). NB. If you want
    //to create content without reference to a node, you can use the initial content
    //used to create the exlorer, e.g., this.explorer.content.create_null_content() 
    create_null_content():record{
        //
        //Define the shape of record's content
        let content:{[index:string]:lib.basic_value}={};
        //
        //Use the content of the current record's content to initialize this one with nulls
        for(const key in this.content){
            content[key]=null;
        }
        //
        //Create a new record, using  the null content and based on the same subject 
        //as this one. Thre is no current selection
        return new record(content, this.subject)
    }
    
    //Delete this content from the storage system to return a crud result, indicating
    //success or failure
    async delete():Promise<lib.crud_result>{
        //
        //Get the primary key of the record to delete. Its key is named the same the
        //ename of this record
        const pk = this.content[this.subject.ename];
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
            ?'ok' 
            :new schema.mutall_error(`The following query was not successful:${sql}`);
    }

    //Returns the header column names of this node to be displayed in a list view.
    get_header_names():Array<string>{
        return this.col_names!
    }

    //Return the properties of this record as key/value pairs. This data is used 
    //for driving the list view of an explorer. 
    async get_properties():Promise<Array<{key:string, value:string}>>{
         //
         //Turn the content from indexed values to key value pairs
         return Object.keys(this.content).map(key=>{ return {key, value:String(this.content[key])}});
     };
 
    //By comparing the original and the values in the tr, write changes to the storage 
    //system
    async save(tr:HTMLTableRowElement):Promise<lib.crud_result>{
        //
        //Collect all the label layouUse questionnaire to save the data
        const layouts:Array<quest.label> = Array.from(this.collect_labels(tr));
        //
        //Write the data to the database
        const result:lib.Imala = await server.exec(
            //
            //Use the php questionnaire class
            "questionnaire",
            //
            //The only constructor argument is the layouts
            [layouts],
            //
            //Use the load method that retirns more structure result
            'load_user_inputs',
            //
            //Load common needs no arguments
            []
        ); 
        //
        //Report the Imala resukt
        return this.report_imala(result, tr);    
    }

    //
    //This method makes the error button visible and puts the error in its 
    //(the button's) span tag which allows the user to view the Imala report.
    //It also updates the primary key field with a "friend", when it is not 
    //erroneous
    private report_imala(mala: lib.Imala, tr:HTMLTableRowElement): lib.crud_result {
        //
        //If there are syntax errors, report them; there cannot be other
        //types of errors, so, abort the process after the report.
        if (mala.class_name === "syntax") {
            //
            //Convert the errors to a string.
            const errors = mala.errors.join("\n");
            //
            const error = new schema.mutall_error(`${ mala.errors!.length} syntax errors:\n ${errors}`);
            //
            //Abort the reporting, as there cannot be other types of errors, and return the error.
            return error;
        }
        //At this time we must have a runtime result. 
        if (mala.class_name !== "runtime") throw new schema.mutall_error(`A runtime result was expected`);
        //
        //Because we are loading one (tr) row at a time, there will be only one indexed entry 
        //in the Imala result
        if (mala.result.length!==1) 
            throw new schema.mutall_error(`Only one runtime entry is expected. ${mala.result.length} found`);
        //
        //Get the only runtime entry
        const entry = mala.result[0].entry;
        //
        //The entry points to an error, return it
        if (entry.error) return new schema.mutall_error(entry.msg);
        //
        //At this point, the saving must have been successful. We need to update
        //the primary key and friendly attributes of the list view, as well as the node
        //of the tree view 
        //
        //Set the tr's primary key; certain tr operations depend on it. 
        //E.g., deleting the tr
        tr.setAttribute('pk', String(entry.pk));
        //
        //Add the friendly component of the record; its done at the tr level
        tr.setAttribute('friend', entry.friend);
        //
        //The affected cell is the first one.
        const td = (<HTMLTableCellElement> tr.cells[0]);
        //
        //Get the span tag for the pk.
        const pk_span = <HTMLSpanElement> td.querySelector(".pk")!;
        //
        //Update the primary key.
        pk_span.textContent = String(entry.pk);
        //
        //Ensure that multi-selector checkbox is also updated with the
        //primary key
        const multiselect = <HTMLInputElement> td.querySelector(".multi_select")!;
        multiselect.value = String(entry.pk);
        //
        return 'ok';
    }
    
 
    //Collect the data to be written to the database as label layouts
    private *collect_labels(tr:HTMLTableRowElement):Generator<quest.label>{
        //
        //Loop through all the cells of the given tr and yield its label if valid
        for(const td of Array.from(tr.cells)){
            //
            //Get the io that matches the td
            const Io = io.io.get_io(td);
            //
            //Get the database and table names
            const dbname = this.subject.dbname;
            const ename = this.subject.ename;
            //
            //Get the column name
            const cname = td.dataset.cname;
            if (cname===undefined)
                throw new schema.mutall_error(`This td has no column name`);
            //
            //Get the value to save
            const value_new = Io.value;
            //
            //Get the original value
            const value_old = this.content[cname];
            //
            //Yield the value, if it is valid for saving
            if (this.value_is_valid(cname, value_old, value_new)) {
                //
                yield [dbname, ename, [], cname, value_new];
            }    
        }
    }    
    //Dedide if a value is fit for saving or not
    private value_is_valid(cname:string, value_old:lib.basic_value, value_new:lib.basic_value):boolean{
        //
        //A primary key is valid for saving if it is not null
        if (cname===this.subject.ename && value_old!==null) return true;
        //
        //Any value is valid for update if it has changed
        if (value_old!==value_new) return true;
        //
        //By default, a value is not valid
        return false;
    }    
}