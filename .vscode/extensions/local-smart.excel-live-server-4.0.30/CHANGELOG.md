# Change Log

All notable changes to the "excel-autoload" extension will be documented in this file.


## [4.0.27]  - 03/06/2023 

### Fix
- Fix the line that is was created when insert code in vba modules

## [4.0.26]  - 09/05/2022 

### Update
- Change activationEvents to all *

## [4.0.24]  - 27/04/2022 

### Update
- Change activationEvents to check if the user has config.json file to fire the extension

## [4.0.24]  - 27/04/2022 

### Fix
- Change node function for check if ribbon tmp folder exists
## [4.0.20]  - 12/02/2022 

### Fix
- Remove the extra line created on export vba to excel
- Fix else formatted

## [4.0.19]  - 25/08/2021 
### Add
- Add Line Numbered for Debug for Access
- Add Button for open Ms Office Applicationsq

- Start to add new Annotations for new features and make code more readable: 
        @ignore-comment (Ignore Comment to show on completion/hover functionality)
        @module-comment (Define the comment block for module ".bas" and ".frm" files)
        @class-comment  (Define the comment block for module ".cls" files)

### Update
- Rebuild Treeview and Add goto definition on click in the macro lists item
- Improve tooltip info on treeview with namespace info
- add icons on treeview macro list items
- Refactor get completion items function 
### Fix
- Fix deprecate rooFolder from vscode workspace
- Fix goto definition link
## [4.0.18]  - 25/08/2021 
### Fix

- Fix treeview load items
## [4.0.17]  - 25/08/2021 

- Fix formatter vba structure for  _
## [4.0.16]  - 25/08/2021 
### Add
- Add Debug.Print on Xdebug
### Fix
- Fix delete xvba_code_debug_parsed files on Active extension
- Fix watch immediate window by add watcher for add and change file
- Fix formatter for Tags in comments
## [4.0.15]  - 24/08/2021 
### Add
- Add Formatter Tab Size Option
### Fix
- Fix Formatter space for Select Case Structure
- Fix Code Line Number Count   
### Update
- Refactor Code

## [4.0.14]  - 23/08/2021 
### Fix
- Fix Log folder create in every project
### Update
- Improve Run macros from VSCODE (Now is Very fast)
- Improve Immediate Window  and Xdebug package 
### Add 
- Add export vba files option with code lines with number 

## [4.0.12]  - 22/08/2021 
### Add 
- Add namespace on subs in Treeview for VBA Macro list
- Add new data types for VBA
- Add Immediate Window Xdebug 

## [4.0.11]  - 31/05/2021 
### Add 
- Add CATScript

## [4.0.10]  - 12/05/2021 
### Add 
- Add new VBA File Definitions

## [4.0.9]  - 07/05/2021 
### Fix 
- Close file read

## [4.0.8]  - 07/05/2021 
### Add
- Import code to Excel Objects


## [4.0.6]  - 25/04/2021 
### Fix
- Fix not found reference for hover


## [4.0.5] - 25/04/2021 
### Add
- Create Custom Ribbons Menus with Custom Images 
- Edit VBA from Access on VSCode 
- Add Hover functionality
- Add Go to Definition (Hold Ctr and Click on function/sub/param)
- Add Build and Production functionality (Files on folder xvba_unit_test  will export to Excel/Access just um Production Mode )

### Update
- Refectory Live Server for Excel and Access 
- Update Autocomplete 
- Extension Size Reduce 
- Remove default option for bootstrap if user don't select anyone

### Fix
- Fix load image ribbons


## [3.0.5] - 30/11/2020 
### Fix
- Fix move frx

## [3.0.4] - 28/10/2020 
### Fix
- Fix formatter  level
- Refectory all services code
- Update all async functions 
### Add
- Add type definition files for auto-complete
- Create comment block for auto-complete
- Add variable auto-complete
- Add auto-complete vba namespace
- Start to add logger pino

### Update
- Refectory snippets for start with x-


## [2.0.15] - 08/10/2020 
### Fix
- Fix formatter functions level 

### Add
- Add hover provider 

## [2.0.13] - 08/10/2020 
### Add
- Formatter functions level 

## [2.0.12] - 31/08/2020 
### Fix

- Fix on creating autocomplete temp file
## [2.0.11] - 29/08/2020 
### Add

- Add on SLP autocomplete for user functions/classes


## [2.0.10] - 27/08/2020 
### Fix

- Fix export log files from Excel.


## [2.0.8] - 25/08/2020 
### Remove 

- Remove auto start XVBA on open
- Remove delete file from Excel on import action

### Fix

- Fix import files from Excel.







## [Unreleased]

- Initial release
- 1.0.1 - Update redfileSync to ReadFile Async.
- 1.0.2 - Add Language Configuration
- 1.0.2 - Add Sublime Syntaxes Highlighting
- 2.0.0 - Update all features, Add Icons and fix some errors
- 2.0.0 - Update Readme images for Set Run Macros On Start in Excel
- 2.0.1 - Create Your own package and share in GitHub
- 2.0.1 - Just Clone from github Third Packages on xvba_modules folder for use
- 2.0.1 - Add .gitgnore file
- 2.0.1 - Add XVBA Unit Test Folder
- 2.0.1 - Add more fields in JSON config file
- 2.0.3 - Stop the XVBA Live Server and Load Files Manually
- 2.0.4 - Add XVBA-Cli version 1.0.0b with package.json file
- 2.0.7 - Reduce extension package size in 90%
- 2.0.8 - Remove delete file from Excel on import action
- 2.0.13 - Add formatter
- 3.0.3 - Change all auto-complete service