# Todo

## Features

- [30-08-21][] Treeview for download packages from XVBA site
- [24-08-21][] Create a debug adapter 
- [24-08-21][] Create Tdd for VBA
- [24-08-21][] Move binary vba forms to separate folder, create a config prop on xvba.config
- [24-08-21][29-08-21] Create a button for open Office Files o VSCode
- [24-08-21][] Create multi excel/access file folders
- [29-08-21][] Add New Treeview with all project functions and subs *** 
- [31-08-21][] Create a Treeview for controllers subs?
- [24-08-21][30-08-21] Change Treeview Title to XVBA - MACRO LIST
- [24-08-21][] Create a List o variables for navigation on code
- [24-08-21][] Create Youtube Tutorial for Immediate Window
- [25-08-21][?] Change vbs to Node FFI Tutorial (node-ffi-napi) or   (npm install win32-api) . We can create vbs on tmp folder cal it
    - [24-08-21][24-08-21] Add Debug.Print on Xdebug
    - [24-08-21][24-08-21] Delete immediate log file on open XVBA Extension
    - [27-08-21][27-08-21] Add goto definition on Macro Treeview
    - [28-08-21][28-08-21] Add Line Number Debug for Access
    - [29-08-21][29-08-21] Add Button for open Ms Office Applications


## Updates

- [28/08/21][] Update get Logs
    - [24-08-21][Canceled] Move Settings to ENV
    - [26-08-21][26-08-21] Add A # on  treeview for functions that cant be run and error messages
    - [26-08-21][26-08-21] Add treeview icons
    - [26-08-21][26-08-21] Improve tooltip info on treeview
    - [28/08/21][28/08/21] Move XML Communication VBScript files to TMP OS folder
 

## Fix

- [01-09-21][] Check formatter for inline if then
    - [01-09-21][01-09-21] Check why formatter regex with g flag not working pretty (write regex.lastIndex= 0 to reset this state.)
- [25-08-21][] Check why formatter stops on regex error
- [24-08-21][] Fix MultiVSCode Window that are creating XVBA folders on both workspace
- [24-08-21][] Fix formatter for subs and functions there is no need the get all statement just the start . If user use underscore the formatter will not work
- [29-08-21][] On Run Macro Check if function or sub has parameters and throw alert that cant be executable
    - [28/08/21][28/08/21] Change some fs sync functions to async
    - [28/08/21][28/08/21] Change all VBScript exe files to vbs on Temp folder
    - [25-08-21]26-08-21[] Check error o treeview
    - [24-08-21][24-08-21] Fix formatter for Tags in comments
    - [24-08-21][24-08-21] Fix delete xvba_code_debug_parsed files on Active extension
    - [24-08-21][24-08-21] Fix watch immediate window by add watcher for add and change file
    - [25-08-21][25-08-21] - Fix treeview load items
    - [26-08-21][26-08-21] - Fix deprecate rooFolder from vscode workspace
    - [30-08-21][30-08-21] - Fix goto definition on hover click
- [31-08-21][] - On show data on immediate window scroll to the end
- [31-08-21][] - Some time immediate window is not showing
- [31-08-21][] - Add on documents the need of enf function or end sub until error handler
- [31-08-21][] - On Text indent start with sub is regex is not indent correct 

## Refactor

    - [30-08-21][] - GoTo Definition
    - [30-08-21][] - Hover
    - [28-08-21][28-08-21] Refactor Settings file