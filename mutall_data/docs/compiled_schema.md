<details>

   <summary> <b>Table of Contents</b> </summary>

- [introduction](#introduction)
- [mutall](#mutall)
   - [overview](#overview)
   - [synopsis](#synopsis)
      - [methods](#methods)
      - [properties](#properties)
      - [example](#example)
- [schema](#schema)
   - [overview](#overview-1)
   - [synopsis](#synopsis-1)
      - [methods](#methods-1)
      - [properties](#properties-1)
      - [interfaces](#interfaces)
- [database](#database)
   - [overview](#overview-2)
   - [synopsis](#synopsis-2)
      - [methods](#methods-2)
      - [properties](#properties-2)
      - [example](#example-1)
- [entity](#entity)
   - [overview](#overview-3)
   - [synopsis](#synopsis-3)
      - [methods](#methods-3)
      - [properties](#properties-3)
- [table](#table)
   - [overview](#overview-4)
   - [synopsis](#synopsis-4)
      - [methods](#methods-4)
      - [properties](#properties-4)
- [view](#view)
   - [overview](#overview-5)
   - [synopsis](#synopsis-5)
      - [methods](#methods-5)
      - [properties](#properties-5)
      - [interfaces](#interfaces-1)
- [column](#column)
   - [overview](#overview-6)
   - [synopsis](#synopsis-6)
      - [methods](#methods-6)
      - [properties](#properties-6)
- [capture](#capture)
   - [overview](#overview-7)
   - [synopsis](#synopsis-7)
      - [methods](#methods-7)
      - [properties](#properties-7)
- [primary](#primary)
   - [overview](#overview-8)
   - [synopsis](#synopsis-8)
      - [methods](#methods-8)
- [attribute](#attribute)
   - [overview](#overview-9)
   - [synopsis](#synopsis-9)
      - [methods](#methods-9)
- [field](#field)
   - [overview](#overview-10)
   - [synopsis](#synopsis-10)
      - [methods](#methods-10)
      - [properties](#properties-8)
- [foreign](#foreign)
   - [overview](#overview-11)
   - [synopsis](#synopsis-11)
      - [methods](#methods-11)
      - [properties](#properties-9)
      - [interfaces](#interfaces-2)
- [pointer](#pointer)
   - [overview](#overview-12)
   - [synopsis](#synopsis-12)
      - [methods](#methods-12)

</details>

# introduction

- In this document, and in others to follow, the `OUTLOOK` library uses the lowercase `snake_case` naming convention to identify the:-

  - files
  - file_paths
  - namespace
  - class names.
  - properties
  - method names
  - method arguments

-This ensures consistency in the management of our codebase.

- The mutall library is built using the OOP design principle whereby classes, inheritance, methods, properties,and interfaces are used.
- The figure below represents the class diagram for the `schema` with emphasis on database modelling.

![mutall_diagram](schema_2020_11_13.png)

`NOTE:` There are two naming identifiers associated with the name mutall namely;-

1. mutall is the super class within the mutall project.

2. mutall is a namespace. Within the scope of this document, a prefix namespace mutall is used to associated classes and files.Therefore, in examples within this document and others, the reference

   ```php
       mutall\class_name()
   ```

   implies that the namespace **mutall** is referenced first and the class_name associated with that namespace follows.
   In general, through this document and in associated/referenced documents, the example above denotes the convention of associating class names with their namespace reference.

- There are some additional conventions within the mutall library such as:

  - `?`. Its usage within the scope of this document implies a `Null denotation` associated with the property.
  - `\`. While it is associated with the namespaces, it also implies `that the implied type is used in its original form i.e. it is not extended` from the `php defined version`.
  - `\Generator`. This is the a Generator function return type and in generators, only yield statements are allowed.

# mutall

## overview

- This is the mutall class that that contains common methods for all classes in the mutall project.

## synopsis

```php
  class mutall\mutall{
   /*Methods*/
      function __construct(bool $throw_exception = true){

      }
      public static function fetch()/*:result*/
      public static function get_error(\Exception $ex):string
      static function post_file():bool
      static function ignore():void
      static function offload_properties(array $dest, array $src):/*:false|array*/
  }
```

### methods

1. **fetch**

   ```php
      public static function fetch()/*:result*/
   ```

   - This method is executed in `export.php` whereby it is designed to support the execution of arbitrary methods and class objects from Javascript by constructing a structure `{class_name, cargs, method_name, margs}` which contains the class name, class arguements (constructor parameters), the method to execute, and the method parameters.

   1. return value

   - The return value of this method is identical to the return value of the method identified by the **(method_name)** during execution.

2. **get_error**

   ```php
      public static function get_error(\Exception $ex):string
   ```

   - Reports a stacked trace of logged exception messages.
   - This means that the execution of methods is collected and the method execution chain is recorded in the trace `to support easier debugging and reporting of errors at runtime`.

   1. parameter

      - An `(\Exception $ex)` as its only parameter and returns/reports a string of`Exception(s)` in a friendly manner that are otherwise unreadable in their unstructured form.

   2. return value

      - The return value from this method is the stack trace as a well formatted string on successful execution and it throws an Exception whenever an error occurs.

3. **post_file**

   ```php
      static function post_file():bool{
   }
   ```

   - This method is responsible for moving uploaded files such as images from any location, to a designated location within the server.
   - One critical file movement convention that applies here is that:-
     - If the uploaded file bears a signature name similar to an existing file, then the **newly uploaded file** overwrites the **existing file.**

   1. return values

   - On successful transfer of the file, the method return `true` and `false` if the transfer was unsuccessful.

4. **ignore**

   ```php
      static function ignore():void{
   }
   ```

   - This method ignores variables that are not used during the destructuring of position based elements.**NOT COMPLETELY DEVELOPED**.

   1. return values

      - This method has no return values.

5. **offload_properties**

   ```php
      static function offload_properties(array $dest, array $src):/*:false|array*/
   ```

   - This method offloads properties from a source to a destination.
   - The source and destination are **valid `JSON arrays`.**
   - If the source is empty, then the method fails to execute and returns `false` which is one of the return values of this method.
   - If the source is not empty, the properties are offloaded and the `destination` JSON array is generated.

   1. parameters

      `destination`

      - The destination `array` where the properties will be offloaded.

      `source`

      - The source `array` where the properties to be offloaded originate from.

   2. return values

      - Returns an **`array`** upon successful execution or **false** on failure.

6. **save_requests**

   ```php
      static function save_requests(string $filename):void
   ```

   - Saves a request generated during while `POST`ing to a `file`.

   1. parameter

      `filename`

      - A file containing a JSON values that are used to save the requested values for easier debugging.

   2. return values

      - This method does not have any return values.

7. **save_session**

   ```php
      static function save_session(string: $username, string: $password):void
   ```

   - Creates a session for the logged in user, using the `username and passqord` to avoid passing these credentials every time we create the database object. These details do not change once the session is created.

   1. parameters

      `username`

      - The name of the user who is signing in to the project.

      `password`

      - The password associated with the user with the above mentioned `username`.

   2. return values

      - No return values are expected from this method.

8. **search_class**

   ```php
      static function search_class(string:$class_name):void
   ```

   - This method resolves the user defined classes located in the `schema\v\code\` directory by automatically loading the classes found in this directory.
   - It assumes one file per class is saved in the root folder.
   - In hind site, the method extracts the `URL` such as `http://localhost:90/tracker/v/code/index.php` and extracts the filename associated with that URL.
   - The path is reconstructed with its full path, whether the path it is located on is a relative or a partial reference, including the document root to the location the file is located. This way any reference to a given class name, it reconstructed, and loaded.

   1. parameters

      - The name of the `class` to resolve.

   2. return values

      - This method does not have return values.

9. **set_requests**

   ```php
      static function set_requests(string $filename):void
   ```

   - Gets the contents of the file that was saved as part of the request in `save_requests()` and generates a JSON string containing the request.

   1. parameters

      - The name of the file that contains the request.

   2. return values

      - This method does no have return values.

### properties

`By default, all properties in this class are public.`

1. class_name

   ```php
      public string $class_name;
   ```

   - A `string`ed name that characterizes every mutall object with this property and is relevant in the reconstruction of the class using the reflection class.
   - The `Reflection class` serves the purpose of broadcasting information about a class. This way, all methods, properties, objects, and constants are loaded and interrogated for error reporting in advance.

2. namespace

   ```php
      public string $ns;
   ```

   - A `string` that contains the namespace identifying the current mutall object. From the `Reflection class`, the namespace is also extracted for easier association of classes and their contents.
   - This namespace classification serves as a grouping of how classes objects, properties, methods, and constants are associated during execution and `it improves the readability of source code which eliminates issues associated with method,property, or constants' name collision`.

3. Exception determinant

   ```php
      public bool $throw_exception;
   ```

   - A boolean exception determinant used to determine when to throw exceptions during the execution of methods or classes. By default the exception determinant is true `bool $throw_exception = true`

### example

`NOTE`:This class is only accessible by extension namely `class class_name extends mutall` and it is a convention that will repeat at least once.

# schema

## overview

- This class is suitable for modelling special mutall objects associated with the mutall database objects namely the database, entity, index, and column.
  -The above named database objects extend this class.
  -This class extends the mutall class.

## synopsis

```php
class schema extends mutall{
   function __construct(string $partial_name= 'no_name'){

   }
   /*Methods*/
   public function full_name():string{}
   public final function save(/*row|null*/ $row):answer{}
   public function logging_is_necessary($row):true{}
}
```

### methods

1. **full_name**

   ```php
      public function full_name():string
   ```

   - Generates a full name associated with a node and is generated from the class name and the partial name of the schema object.
   - The combination is handled by a method because the partial name may change during runtime for example during barrel saving.

   1. return values

      - Returns a `string` that represents the full_name on successful execution.

2. **save**

   ```php
      public final function save(/*row|null*/ $row):answer
   ```

   - Exports a schema object to the database by:-
     - opening the save tag named by using the partial name.
     - writing the a schema object to the database.
     - closing the save tag.
   - The `final` keyword associated with this method implies that the method cannot be overridden.

   1. parameters

      `row`

      - The input of a row detail if the save was initiated from a table.

      `null`

      - The input is null if the initiation of the save came from elsewhere apart from a table.

   2. return values

      - The method returns an answer upon successful execution. An answer is an expression that participates in the save operation.
      - Coming from a typescript definition of return types, it is easier to represent the [answer](#answer) with `type answer= myerror|scalar`.
      - Expressing ourselves in PHP in this format is difficult and can be made possible by using the answer interface.

3. **loggin_is_necessary**

   ```php
      public function logging_is_necessary($row):true
   ```

   - This method determines whether logging is necessary and by default, logging is necessary.
   - It is designed to control logging in the case of a barrel to avoid cluttering of the log file
     with repetitive errors.

   1. parameters

      - The row is not used as a parameter **\*\***.

   2. return values

   - Returns `true` upon successful execution of the program.

### properties

1. partial_name

   ```php
      public string $partial_name

   ```

   - The partial name is generated by the name of the schema object plus the database source it requires to formulate xml tags, indexing joints, constructing structurals, e.t.c.

2. roll_back_on_fatal_error

   ```php
      static bool $roll_back_on_fatal_error= false
   ```

   - This toggles a default auto commit of transactions to false to influence a rollback when transactions are unsuccessful and commit upon the successful termination of transaction and returns true.
   - By default, it is false, which implies that a transaction should not rollback incase there is an error at runtime.

3. errors

   ```php
      public array /*error[]*/ $errors=[]
   ```

   - Schema objects take two forms, namely a static and an activated form. When a schema object is activated , any generated errors are managed by this property.

4. answer

   ```php
   public /**/$answer
   ```

   - After a schema object is written the database, the result is stored in this property.

### interfaces

1. answer

   ```php
   interface answer{
     function __toString();
     function get_position()/*:row_index, col_index?]|null*/;
   }
   ```

   - An answer is an expression that can actively participate as an output expression from a save operation. From a `Typescript type` definition, the answer can be specified as `type answer= myerror|scalar`. Using PHP, expression union return values is not directly possible, but can be done by using `interfaces`.

   a. toString

   ```php
   function __toString();
   ```

   - Generates an answer that must be converted to a string to enable creation of xml-like logs.

   b. get_position

   ```php
   function get_position()/*[row_index, col_index?]|null*/;
   ```

   - Gets the position data associated with an answer to enrich an answer with position data when its available. Data can be recovered using this function as well

# database

## overview

- This is the class that is used to model the database objects.
  - One of the objects it models is the `schema object` that allows saving to multiple database.
  - The other object is the `database object` that models the database ready for CRUD operations to be performed on the `modelled database`.

## synopsis

```php
   // class database

   class database extends schema{
      // constructor

      function __constructor(string $name, bool $complete=true, bool $throw_exception= true){}
      //
      //Methods
      public function authenticate(string $name, string $password):bool{}
      public function register(string $email, string $password):void{}
      public function chk(string $sql):string{}
      public function get_sql_data(string $sql):array{}
      public function accounting(string $account_name):array{}
      public function export_structure():database{}
      public function query():int{}
      public function lastInsertId():int{}
   }

```

### methods

1. **authenticate**

   ```php
       public function authenticate(string $name, string $password):bool
   ```

   - Used to check whether a user with the given username `$name` and password `$password` credentials is found in the database or not.

   1. parameters

      `name`

      - The name of the user to find in the database.

      `password`

      - The password of the user associated with the name above in the database.

   2. return values

      - An error is throw when more than `name asscociated with the user is found`.
      - If a user is FOUND in the database, the return value of `true` is observed.
      - If a user is NOT FOUND in the database, the return value of `false` is observed.

2. **register**

   ```php
       public function register(string $email, string $password):void
   ```

   - Create a new account for a user using the provided `username` and `password`.
   - If :-
   - `NO USER` is found in the database,the user is created and linked to the `entity` used to hold all user related information which minimizes errors that may occur from double registration of the user.
   - `THE USER EXISTS WITHOUT A PASSWORD`, the password associated with the user's name is saved.
   - `A USER EXISTS` with the provided credentials, an Exception indicating that the user with the specified email already exists is provided.

   1. parameters

      `email`

      - The email to register the current user with. This can also be the user name we need to associate a user with.

      `password`

      - The password to associate the registering user with.

   2. return values

   - This method does not return any values.

3. **chk**

   ```php
       public function chk(string $sql):string
   ```

   - Check if an `sql query` is valid or conforms to the database specified querying standards depending on the database engine `(mysql, postgres,oracle,mssql,or sqlite)`selected.

   - Suitable for debugging a query before executing it to prevent runtime errors.

   1. parameters

      `sql`

      - The query string to check for errors.

   2. return values

      - The return value is the `string` if the query provided had no errors.
      - If the query provided is invalid, an `Exception` is thrown with the message associated with the violation/error displayed before the query string.

4. **get_sql_data**

   ```php
    public function get_sql_data(string $sql):array
   ```

   - Execute the `sql` provided to obtain an array of the results.

   1. parameters

      `sql`

      - The `sql` string that yields the results to be extracted.

   2. return values

      - Returns an `array of results` if the execution was successful and an `Exception` error if the there was an error in the query.

5. **accounting**

   ```php
    public function accounting(string $account_name):array
   ```

   - Retrieves all the accounting information associated with a specified account saved in the database.

   1. parameters

      `account_name`

      - The name of the account to retrieve accounting information about.

   2. return values

      - Returns an array of accounting information that is associated with the provided account name upon successful execution.

6. **export_structure**

   ```php
   public function export_structure():database;

   ```

   - Exports the entire database structure as it is defined by the PDO, with all its entities and columns.

   1. return values

      - The return value of `export_structure` is a database object which can be used to reconstruct the database using its entities on the client-side platform(s).

7. **query**

   ```php
    public function query($sql):int;
   ```

   - Extracts the number of affected rows associated from the provided query.

   1. parameters

      `sql`

      - The query to execute and find the rows affected by the query.

   2. return values

   - The return value is an `integer` of the number of rows affected by the query.

8. **lastInsertId**

   ```php
    public function lastInsertId():int;
   ```

   - Extract the `Id/primary key` of the last inserted record in the database.
   - As the name dictates, its applicability is limited to the `Insertion` process.

   1. return value

      - The return value is a `string/number` when there is value that was previously inserted.

### properties

1. entities

   ```php
       public array $entities= [];
   ```

   - This array is the collection of the tables needed to create the database. It is initialized as an empty array by default and it is populated later when the database object is created.

2. pdo\*\*(in the lastInsertId method, it is stated to be protected)

   ```php
       public \PDO $pdo;
   ```

   - Allows users to instantiate a database using this class to query and retrieve information from the database.
   - All database objects constructed within this class originate from the `PHP Data Objects(PDO)`.
   - It is initialized as a property to avoid the class from extending a PDO object.

3. report

   ```php
       public string $report;
   ```

   - This is where any errors that are reported are saved.

### example

- Modelling any database that requires the creation of a database object before making queries to the database. To use the database's object, three parameters are required namely;
  - A `mandatory stringified` name of the database.
  - A `boolean` value to determine whether you want the complete database object with all its entities revealed.
    - The default value is `true` to show the complete database structure.
  - A `boolean` value to determine whether to throw an exception of `database related` errors as soon as they are encountered.
    - The default value is `true`.
    - Some of these errors may include indexing errors in the database.

```php
    $dbase = new database("mutall")
```

```NOTE
- If no database name is provided, then a database name is selected by default. Ensure that the database to prevent errors from occurring during database modelling.

```

1. authenticate
2. register
3. chk
4. get_sql_data
5. query
6. accounting
7. export_structure
8. query

# entity

## overview

- This class represents an entity. By definition, an entity is a `schema object` which implies that it can be saved to a database.

## synopsis

```php
 abstract class entity extends schema implements expression{

   //Methods
   function __construct(string $name){

   }
   function __toString():string{}
   function yield_entity():\Generator{}
   function yield_attribute(): \Generator{}
   function foreigners():\Generator{}
   function structural_foreigners():\Generator{}
   function structural_pointers():\Generator{}
   function get_id_columns():array{}

 }
```

### methods

1. **toString**

   ```php
    abstract function __toString():string{}
   ```

   - Compiles the complete `stringified version` associated with this entity as an sql object for use in array methods.

   1. return values

      - The return value is a `string` made up of the `database name` and the `entity name`.

2. **yield_entity**

   ```php
   abstract function yield_entity():\Generator{}
   ```

   - An entity yields itself.

   1. return values

      - This method returns a `\Generator` that is an `array of entities`.

3. **yield_attribute**

   ```php
   abstract function yield_attribute(): \Generator{}
   ```

   - Generates the attributes associated with an entity which are also based on its columns. The `attributes` are generated in a for each column.

   1. return values

      - This method returns `an iterable array of attributes` in the form of a `\Generator`.

4. **foreigners**

   ```php
    abstract function foreigners():\Generator/* foreigner[] */{}
   ```

   - Generates the foreign key columns associated with this entity.

   1. return values

      - `an array of foreigners` wrapped in the `\Generator`.

5. **structural_foreigners**

   ```php
    abstract function structural_foreigners():\Generator/*foreigner[]*/{}
   ```

   - Structural foreigners are `foreign keys that are not used for reporting purposes`. This method iterates through all columns associated with this entity and extracts the structural foreigners.

   1. return values

      - An `array of structural foreigners` in the `\Generator`

6. **structural_pointers**

   ```php
   abstract function structural_pointers():\Generator/*pointers[]*/{}

   ```

   - Yield the structural pointers associated in the `current database` using the structural foreign keys.
   - The generated foreigner is a marked as a pointer if `its database are the same and the table names are the same`.

   1. return values

      - An `array of pointers` enclosed in the `\Generator`.

7. **get_id_columns**

   ```php
    abstract function get_id_columns():array{}
   ```

   - Extract the mandatory columns associated with this entity, `the columns that are not nullable i.e. those that are not defined as NULL`, and those used as ids as a record that needs to be saved.

   1 return values

   - An `array` of the mandatory columns.

### properties

1. name

   ```php
       public string $name;
   ```

   - The name assigned/associated with an entity.

2. columns

   ```php
       public array $columns;
   ```

   - The columns of the entity.

3. indices

   ```php
   public array $indices;
   ```

   - The indices of this entity that are initialized during the construction of the database object.

# table

## overview

- This class models the actual table in the database by extending the entity and this way it includes the indexes as a dependency.

## synopsis

```php

   class table extends entity{

      //
      //Methods
      function __construct(database $parent, string $name){

      }
      public function pointers():\Generator{}
      public function get_friend(int $pk):string{}


   }

```

### methods

1. **pointers**

   ```php
       public function pointers():\Generator{}
   ```

   - Yields an array of pointers as all the foreigners that reference this table and associated with the current database.

   - This method is similar to `foreigners()` with the only difference being that its output cannot be buffered, because with the ability to add a view to the database, the pointers to an entity can change.

   1. return values

      - The return value is `an array of pointers` when it executes successfully.

2. **get_friend**

   ```php
   public function get_friend(int $pk):string{}
   ```

   - Retrieve the `friendly component` of the primary key passed as the only `argument` to this method.
   - The column may be indexed by the column name.

   1. return values

      - This method returns a string which of the friendly component/column on successful execution.
      - If `no friendly component` is defined or associated with the provided primary key, an `Exception is flagged` to note that none of the identified columns are associated with this `primary key.

3. **get_friendly_name**

   ```php
   public function get_friendly_name(int $pk):string{}
   ```

   - Extracts and returns the friendly name of the given primary key.

   1. parameters

      `pk.`

      - The primary key that extracts the friendly names associated with this primary key.

   2. return values

      - The return value is a `string` describing the friendly name of the primary key.
      - If `no friendly name` is obtained, an exception is thrown with the message
        `Invalid friendly name result ....`. This message means that there is no friendly name associated with this primary key.

### properties

1. dbname

   ```php
       public string $dbname;
   ```

   - The database name in which this table is contained.

2. depth

   ```php
       public ?int $depth= null;
   ```

   - The relation depth of this entity. It is set to null by default.

3. comment

   ```php
       public $comment;
   ```

   - The `JSON` user information retrieved from the comment after it is decoded.

4. indices

   ```php
       public array $indices=[];
   ```

   - The unique indices of this table/entity that is used for identification of a record in a table. It is set before being used.
   - By default, this index is empty and is `updated during database creation when the indices created are valid`.

# view

## overview

- This class models the sql's of type select that extend an entity, so that they can take part in the database modelling exercise to resolve the root entity that requires the inclusion of a config file in the main application.
- This class cannot be instantiated from javascript because the data types are not that simple.

## synopsis

```php

class view extends entity{
   //
   //Methods
   function __construct(entity $from, array $column, join $join, string $name, expression $where=null, array /*column*/ $group_by= []){

   }
   public function id():string{}
   public function yield_entity():\Generator{}
   public function yield_attribute():\Generator{}
   public function execute()/*:value[][cname]s*/{}
   public function stmt():string{}
   public function to_str():string{}
}

```

### methods

1. **id**

   ```php
       public function id():string{}
   ```

   - The short form of identifying a view which is a concatenated string of the `database name` and the `entity name`.

   1. return value

   - The return value is a string of the database and entity name.

2. **yield_entity**

   ```php
       public function yield_entity():\Generator{}
   ```

   - Generates the trivial entities in this view and includes all the target entities that are involved in this join.

   1. return value

   - This method returns a `Generator` consisting of the entities involved in the join.

3. **yield_attribute**

   ```php
       public function yield_attribute():\Generator{}
   ```

   - Generates the columns that are involved in this view and are useful for editing a non trivial view(sql).

   1. return value

      - The return value of this method is a `Generator` that consists of the columns involved in the sql.

4. **execute**

   ```php
       public function execute()/*:value[][cname]s*/{}
   ```

   - Executes the `sql or query` to return the data as a double array.
   - It is assumed that at this point all the view constructor variables are set to their desired values.
   - For extensions like editor and selector, it is not true. They must override this method to prepare the variables before calling this method.

   1. return value

      - The return value of this method is a double array.

5. **stmt**

   ```php
       public function stmt():string{}
   ```

   - Extracts the string representation of a select sql statement.

   1. return value

      - The return value is a `string` containing the sql.

6. **to_str**

   ```php
       public function to_str():string{}
   ```

   - Compiles the scalar value associated with an sql statement.

   1. return values

      - The return value is a `string` of the scalar value extracted from the sql statement.

### properties

1. where

   ```php
       public ?expression $where;
   ```

   - Defines the criteria of extracting information from an entity as a boolean expression.

2. from

   ```php
       public entity $from;

   ```

   - This `from` clause identifies the origin of this view which is the `entity`.

3. join

   ```php
       public ?join $join;
   ```

   - This view has connections on the various entities that are involved in this sql.

4. group_by

   ```php
       public group_by= [];
   ```

   - Other clauses associated with an sql that the user can provide after a view is created.

### interfaces

1. expression

   ```php
       interface expression{
           //
           //
           function to_str():string;
           //
           function yield_entity():\Generator;
           //
           function yield_attribute():\Generator;
       }
   ```

   -This general form of an expression was originally designed to support database querying operations

   1. **`function to_str():string`**

      - Every expression must be a valid sql expression. - In most cases, this method returns the same value as the `_toString()` magic method but in some cases, it does not. For example the `__toString()` of the if field in a selector such as the `mutall.application.id__` whereas its to_str() value is `concat(mutall_login.application.name,"/")`.
      - Therefore, the `__toString()` of an application entity is e.g. `mutall_login.application`but that of the application expression, to_str() refers to the primary key field`mutall_login.application.application`.

   2. **`function yield_entity(): \Generator`**

      - Yield the entities that participate in this expression.
      - It is important for defining `search paths for partial and save_indirect view`.
      - This is the method that makes it possible to analyse the mutall view and do things that would currently not be possible without parsing sql statements.

   3. **`function yield_attribute():\Generator`**

      - Yield the primary attributes that are used in formulating this expression.
      - It is important for determining if a view column is directly editable or not.
      - It also makes it possible to express values by accessing the primary entities that constitute them.

# column

## overview

- This class is used to model columns of an entity as the smallest package that can be saved to the database using an expression.

```text
    NOTE: This class is not abstract as we can use it to create columns. This is important in the context of left joins.
```

## synopsis

```php
   class column extends schema implements expression{
      //
      //Methods
      function __construct(entity $parent, string $name){

      }
      public function get_error_report(int $no_of_errors, string &$report):void{}
      public function yield_attribute():\Generator{}
   }

```

### methods

1. **get_error_report**

   ```php
       public function get_error_report(int $no_of_errors, string &$report):void{}
   ```

   - Processes and outputs the error report and the number of errors obtained at the database level to the user when constructing a database.

   1. parameters

      `$no_of_errors`

      - The number of errors in a database.

      `$report`

      - The error report generated from a database.

2. **yield_attribute**

   ```php
    public function yield_attribute():\Generator{}

   ```

   - yields an attribute column since all other columns cannot yield their own column
     `NOTE: This method is not yet fully developed/documented.`.

3. **yield_entity**

   ```php
   public function yield_entity():\Generator{}
   ```

   - Creates the entity of this column or the entity associated with this column.

   1. return value

      - The return value is an entity.

### properties

1. name

   - The name of the column.

   ```php
      public string $name;
   ```

2. ename

   - The name of the entity that is the parent/home of this column.

   ```php
      public string $ename;
   ```

# capture

## overview

- This class models the `primary columns` as opposed to the `derived columns` needed for data capture and storage operations.
- The columns are extracted from the information schema directly and therefore, `they should be checked for integrity`.
- It extends the column class and it is abstract. This means that other classes can only implement the methods in this class.

## synopsis

```php

   abstract class capture extends column{
      //
      // Methods
      function __construct(table $parent,string $name,
        string $data_type,
        ?string $default,
        string $is_nullable,
        string $comment,
        ?int $length,
        string $type){

      }
      abstract function __toString():string{}
      abstract function is_cross_member():void{}
      abstract function is_id():bool{}
      abstract function is_descriptive():bool{}
   }

```

### methods

1. **\_\_toString**

   ```php
      abstract function __toString():string{}
   ```

   - Extracts a stringified version of a capture column which is the same as that of an ordinary column prefixed with the database name to take care of scenarios where we have multiple databases.

   1. return values

      - The return value is a string of the capture column.

2. **is_cross_member**

   ```php
      abstract function is_cross_member():void{}
   ```

   - Extracts the non_structural columns of this `entity` (cross members).
   - These are the optional foreign key columns, namely those that are not nullable.
   - They are important for avoiding cyclic loops during saving of data to the database.

   1. return values

      - This method does not have a return value.

3. is_id

   ```php
      abstract function is_id():bool{}
   ```

   - Evaluates whether this column is used by any identification index. `Identification columns` are part of the structural columns.

   1. return values

   - The return value of this method is `true` if this column is used for as identification index and `false` if it is not used.

4. is_descriptive

   ```php
      abstract function is_descriptive():bool{}
   ```

   - Finds out whether this column can be used for formulating a friendly identifier.'

   1. return values

      - The return value is `true` if this column is used in the formulation.

### properties

1. dbname

   ```php
    public string $dbname;
   ```

   - The name of the `current database` to support global access to the database and entity names.

   `NOTE:Constructing the details of a column requires the following;`

2. comment

   ```php
    public ?string $comment;
   ```

   - Acts as a container that stores the metadata of this column as a structure `if the metadata is not offloaded` since we need to acquire it in its original form.
   - The `comment` can also be optional since it is set to be null as denoted by `?string $comment`.

3. default

   ```php
    public ?string $default;
   ```

   - The database default value for this column.
   - The default can also be optional.

4. data_type

   ```php
    public string $data_type;
   ```

   - The acceptable datatype for this column such as the `text, number, auto-number etc`s.

5. is_nullable

   ```php
    public string $is_nullable;
   ```

   - This is defined if this column is mandatory or not.
   - A stringified value of `"YES"` if not nullable or a stringified value of `"NO"` if it is not nullable.

6. length

   ```php
    public ?int length;
   ```

   - The size of the column. `This value is optional`.

7. type

   ```php
    public string $type;
   ```

   - The type of the column. This is needed for the extraction of enumerated choices.

# primary

## overview

- Primary and foreign key columns are used for establishing relationships with the entities during data capture.
- The primary key column:-
  - Is named the same as the entity where it is located.
  - It has the `autonumber` datatype or the `int` that is an `AUTOINCREMENT`.
- It extends the capture class.
- The constructor parameters are passed via the constructor to the parent class which is the capture class.

## synopsis

```php
    class primary extends capture{
         //
         //Methods
      function __construct(
         entity $entity,
         string $name,
         string $data_type,
         ?string $default,
         string $is_nullable,
         string $comment,
         ?int $length,
         string $type){

         }

      public function yield_entity():\Generator{}
    }
```

### methods

1. [yield_entity](#yield_entity)

```php
    public function yield_entity():\Generator{}
```

- Yield the attribute of an entity from a database that is opened.

  1. return values

  - The return value is a the `name of the entity` wrapped up in the `\Generator`.

# attribute

## overview

- This class creates/models attributes with its structure components as defined in the capture above.
- Attributes have very special columns that have options that describe the data they hold such as `the data type`, `their lengths`.
- These descriptions are not owned by other columns.
- This class extends the capture class and implements the expression interface.

## synopsis

```php
 class attribute extends capture implements expression{
   //
   //Methods
   function __construct(
      entity $entity,
      string $name,
      string $data_type,
      ?string $default,
      string $is_nullable,
      string $comment,
      ?int $length,
      string $type
      ){

   }
   public function yield_attribute():\Generator{}

 }
```

### methods

1. **yield_attribute**

```php
    public function yield_attribute():\Generator{}
```

- Generates this`(current)` attribute.

  1. return value

  - This method returns a `Generator` of the current attribute.

# field

## overview

- This class is used for modelling the derived columns, i.e., columns that are not read off the information schema.
- It extends the `column class` and implements the `expression` interface.

## synopsis

```php
    class field extends column implements expression{
      function __construct(){

      }
      public function __toString():string{}
    }
```

### methods

1. **\_\_toString**

   ```php
       public function __toString():string{}
   ```

   - Overrides the `PHP magic constant __toString` to ensure that the dbname is not included as part of the name of the field.

   1. return values

   - The return value is a string that is usable in the database to associated this entity to its name.

### properties

1. exp

   ```php
       public expression $exp;
   ```

   - The calculated/derived expression represented by this field.

# foreign

## overview

- The foreign class models the foreign keys columns in the database.
- A foreign key column participates in data capture.

  - It implements the many-to-one-link between 2 entities:-
    - The first one is the `home entity` that houses the column
    - The second one is the `away entity` and it is the one pointed to by the relationship.

- This class extends the capture column and implements the ilink interface.

## synopsis

```php
    class foreign extends capture implements ilink{
      function __construct(
         entity $entity,
        string $name,
        string $data_type,
        ?string $default,
        string $is_nullable,
        string $comment,
        ?int $length,
        string $type,
        \stdClass $ref
      ){}
      public function verify_integrity():void{}
      public function away():void{}
      public function home():entity{}
      public function yield_entity():\Generator{}
      public function is_hierarchical():bool{}
    }
```

### methods

1. **verify_integrity**

   ```php
      public function verify_integrity():void{
      }
   ```

   - A foreign (key) must satisfy the following conditions to be compliant with the framework standards:-

     a. The data type of the foreigner must of int.
     b. The referenced column name must be a primary key.

   - If the foreign is not an `integer`, an error is thrown to show that the `datatype of the column (foreign)` is not of `type int`.
   - If the referenced column is not a primary key, an `Error` is thrown which dictates that the `foreign key column should reference the reference a table using the primary key`.

   1. return values

   - There is no return value for this method.

2. **away**

   ```php
      public function away():entity{
      }
   ```

   - Retrieves and returns the entity that the foreign key is pointing at `the referenced entity`.

   1. return values

   - The return value of this method is the entity being referenced as the away component.

3. **home**

   ```php
      public function home():entity{
      }
   ```

   - Extracts the entity in which the foreign key is `housed`.

   1. return values

      - The return value of this method is the entity being housed.

4. **yield_entity**

   ```php
      public function yield_entity():\Generator{
      }
   ```

   - Generates the entity associated with this column.

   1. return values

      - The return value of this column is the entity associated with this column in the `Generator`.

5. **is_hierarchical**

   ```php
      public function is_hierarchical():bool{
      }
   ```

   - Tests whether a foreign key is hierarchical or not.

   1. return values

      - This method returns true if the foreign key is hierarchical and false if it is not hierarchical.

### properties

1. ref

   ```php
       public \stdClass /*{ref_table_name, ref_db_name}*/ $ref;
   ```

   - The name of the referenced table and database as an object.

### interfaces

1.ilink

- The link interface allows the expression of relationships between 2 columns as a string.

```php
interface ilink{
    function on_str:string;
}
```

- A link implements the `on_str` needed to model joins in a join clause such as strings for the:-
  - many-to-one case.
  - one-to-one case.

# pointer

## overview

- This class models a column in an entity that points to a referenced entity.
- The difference between a pointer and a foreign is that `the pointer` is not home at the entity it is found.
- This class extends the `foreign` class.
- The column constructor parameter is passed to the parent class.

## synopsis

```php
   class pointer extends foreign{
      //
      //Methods
      function __construct(foreign $col){

      }
      public function away():entity{}
      public function home():entity{}
      public function to_str():string{}
   }
```

### methods

1. **away**

   ```php
      public function away():entity{}
   ```

   - Extracts the home of the referenced entity.
   - `pointers` run in the opposite direction to corresponding foreign keys and so that its away entity is the home version of its foreign key.

   1. return values.

      - This method returns the entity identified as the home of the referenced entity.

2. **home**

   ```php
      public function home():entity{}
   ```

   - Extracts the referenced entity. Since `pointers` run in the opposite direction of the corresponding foreign keys, the home entity is the away entity of its foreign key.

   1. return values

      - The return value of this method is the referenced entity.

3. **to_str**

   ```php
      public function to_str():string{}
   ```

   - Compiles and returns an expression string version of a column which is the concatenation of the `dbname, ename, and cname`.

   1. return values.

      - The return value is the concatenated `string`.
