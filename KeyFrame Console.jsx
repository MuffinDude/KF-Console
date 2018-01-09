var mainComp = app.project.activeItem;
var mainLayer = mainComp.layer(1);
var mainWindow = new Window("palette", "KF Console", undefined);


// ------------------- TO CHANGE -----------------------

var programVersion = "2018";

// ------------------- TO CHANGE -----------------------

var presetFolder =  File('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ '+programVersion+'\\Support\ Files\\Presets\\AnimationMaster');
var scriptLocation = File('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ '+programVersion+'\\Support\ Files\\Scripts\\01-KeyFrame\ Console.jsx');
var shortcutPath = 'C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ '+programVersion+'\\Support\ Files\\Presets\\AnimationMaster\\shortcuts.txt';

var delIcon = File ('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ '+programVersion+'\\Support\ Files\\Presets\\AnimationMaster\\delico.png');
var renameIcon = File ('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ '+programVersion+'\\Support\ Files\\Presets\\AnimationMaster\\renamico.png');
var shortcutIcon = File ('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ '+programVersion+'\\Support\ Files\\Presets\\AnimationMaster\\shortcutico.png');



var shortCutFile = File(shortcutPath);
var  files = new Array();
files = presetFolder.getFiles ("*.ffx");
var bsize = [0,0,30,30];

// ------------------- FILLS WINDOW -----------------------
for(i = 0; i < files.length; i++){
    var myButtonGroup = mainWindow.add("group");
    var supername = String(files[i]);
    var startPosition = supername.lastIndexOf( "/" ) ;
    var shortCutFile = File(shortcutPath);
    var shortCutChar = "SC";
    var shortcutSwitch = false;
    var buttonDel = myButtonGroup.add("iconbutton", undefined, delIcon, {style:"toolbutton"});
    var buttonX = myButtonGroup.add("button", undefined, supername.substring(startPosition+1, supername.length -4).replace(/%20/g, " "));
    var buttonRename = myButtonGroup.add("iconbutton",undefined,renameIcon, {style:"toolbutton"});
    
    if (shortCutFile.exists){
        shortCutFile.open('r');
        var content = shortCutFile.read();
        var lines = content.split('\n');
        for (j = 0; j < lines.length-1; j++) {
            if (supername.toString().replace(/%20/g, " ") == lines[j].slice(0,lines[j].lastIndexOf(".") + 4).replace(/%20/g, " ")){
                shortCutChar = lines[j].slice(lines[j].lastIndexOf(".") + 4);
                var buttonShortcut = myButtonGroup.add("button",bsize, shortCutChar);
                shortcutSwitch = true;
            }
        }
        shortCutFile.close();
    }
    
    if (!shortcutSwitch) var buttonShortcut = myButtonGroup.add("iconbutton",undefined,shortcutIcon, {style:"toolbutton"});
    
    buttonDel.name=i;
    buttonDel.onClick=deleteMyPreset;
    buttonRename.name=i;
    buttonRename.onClick=renamePreset;
    buttonX.name= i;
    buttonX.onClick=applyMyPreset;
    buttonShortcut.name=i;
    buttonShortcut.onClick=assignShortcut; 
    
    myButtonGroup.alignment = [ScriptUI.Alignment.FILL,ScriptUI.Alignment.FILL];
    buttonX.minimumSize.width=170;
};

// ------------------- USING SHORTCUT -----------------------
mainWindow.addEventListener ("keydown", function (k){shortCut(k)});
function shortCut (k){
    var shortCutFile = File(shortcutPath);
    shortCutFile.open('r', undefined, undefined);
    var content = shortCutFile.read();
    var lines = content.split('\n');

    for (j = 0; j < lines.length-1; j++){
          if (k.keyName == lines[j].slice(-1)) { 
            for(z = 0; z < files.length; z++){
                 if(lines[j].slice(0,lines[j].length-1) == files[z].toString()){
                    mainLayer.applyPreset(files[z]);
                    mainWindow.close();
                 }
             }
         }
    }
    shortCutFile.close();
}

// ------------------- RENAMING PRESETS -----------------------
function renamePreset(){
    var buttonName = files[this.name];
    var box = new Window('dialog');  
    box.panel = box.add('panel', undefined, "New Name");  
    var panel_text1 = box.panel.add('edittext', undefined, ""); 
    panel_text1.characters = 30;
    panel_text1.active = true;
    var buttonRe = box.add("button",undefined,"Save");
    buttonRe.onClick=renameP;
    
    box.addEventListener ("keydown", function (kd) {pressedEnter (kd)});
    function pressedEnter (k) {
        if(k.keyName === "Enter")renameP();
    }

    function renameP(){
        var changeSwitch = true;
        if (panel_text1.text == "") box.close();
        else{
            for (j = 0; j < files.length; j++) {
                if (files[j].toString().slice(files[j].toString().lastIndexOf("/") + 1 ,files[j].toString().length-4) == panel_text1.text){
                    alert("This name is already in use");
                    changeSwitch = false;
                    break;
                }
            }
        
            shortCutFile.open('r');
            var content = shortCutFile.read();
            var lines = content.split('\n');
            var textArray = [];
            var shortcutFound = false;
            
            if (changeSwitch){
                for (j = 0; j < lines.length-1; j++) {                   
                    if (lines[j].slice(lines[j].lastIndexOf("/") + 1 ,lines[j].lastIndexOf(".")) == buttonName.toString().slice(buttonName.toString().lastIndexOf("/") + 1 ,buttonName.toString().length-4)){     
                        var oldLine = lines[j];
                        var newLine = oldLine.slice(0, oldLine.lastIndexOf("/") + 1) + panel_text1.text+ oldLine.slice(oldLine.lastIndexOf("."));
                        textArray.push(newLine);
                        shortcutFound = true;         
                    } else  textArray.push(lines[j]);
                }
            
                if (shortcutFound){
                    shortCutFile.open('w');
                    for (i = 0; i < textArray.length; i++){
                        shortCutFile.write(textArray[i] + '\n');
                    }
                    shortCutFile.close();
                }
            
                buttonName.rename(panel_text1.text + ".ffx");
                box.close();
                mainWindow.close();
                $.evalFile(scriptLocation);
            }
        }
    }
    box.show();
}

// ------------------- ASSIGNING A SHORTCUT -----------------------
function assignShortcut(){
    var box = new Window('dialog');  
    var buttonName = files[this.name];
    box.addEventListener ("keydown", function (kd) {pressed (kd)});
    
    function pressed (k) {
         if (!shortCutFile.exists){  
            shortCutFile = new File (shortcutPath);
            shortCutFile.open('w');
            shortCutFile.write(buttonName.toString() + k.keyName + '\n');
            shortCutFile.close();
            //alert("created a new file");
         } else {
            shortCutFile.open('a');
            var content = shortCutFile.read();
            var lines = content.split('\n');
            var doneSwitch = false;
            var renameSwitch = false;
            var presentButtonName = buttonName.toString().slice(buttonName.toString().lastIndexOf("/") + 1 ,buttonName.toString().length-4);            
            var textArray = [];
            
            for (j = 0; j < lines.length-1; j++) {
                var presetNameInFile = lines[j].slice(lines[j].lastIndexOf("/") + 1 ,lines[j].length-5);            
            
                if (presetNameInFile == presentButtonName){
                    var oldLine = lines[j];
                    var newLine = oldLine.slice(0, oldLine.lastIndexOf(".ffx") + 4) + k.keyName;
                    textArray.push(newLine);
                    
                    doneSwitch = true;
                    renameSwitch = true;
                    shortCutFile.writeln(buttonName.toString() + k.keyName);
                    //alert("found existing one and replaced");
                    shortCutFile.close();
                    box.close();
                    
                }else if (k.keyName == lines[j].slice(-1)){
                    alert("Shortcut already in use by " + presetNameInFile); 
                    doneSwitch = true;
                    shortCutFile.close();
                    box.close();
                    break;
                }else textArray.push(lines[j]); 
            }
        
            shortCutFile.close();
        
            if(renameSwitch){
                shortCutFile.open('w');
                for (i = 0; i < textArray.length; i++){
                    shortCutFile.write(textArray[i] + '\n');
                }
                shortCutFile.close();
            }
        
            if (!doneSwitch){
                shortCutFile.open('a');
                shortCutFile.writeln(buttonName.toString() + k.keyName);
                //alert("made new shortcut");
                shortCutFile.close();
            }
         }
         mainWindow.close();
         $.evalFile(scriptLocation);
         box.close();
    }

    box.panel = box.add('panel', undefined, "Press the button on the keyboard that you wish to use as a shortcut");  
    box.show();
}

// ------------------- DELETING PRESETS -----------------------
function deleteMyPreset(){
    var MyFile = files[this.name];
    var deleteSwitch = false;
    if (MyFile.exists){  
            MyFile.remove();
            
            shortCutFile.open('r');
            var content = shortCutFile.read();
            var lines = content.split('\n');
            var textArray = [];
            for (j = 0; j < lines.length-1; j++) {
                if (lines[j].slice(0, -1) != MyFile)textArray.push(lines[j]);
                else deleteSwitch = true;
            }
            shortCutFile.close();
            if(deleteSwitch){
                shortCutFile.open('w');
                for (i = 0; i < textArray.length; i++){
                    shortCutFile.write(textArray[i] + '\n');
                }
                shortCutFile.close();
            } 
    }else{
            alert("There's an error with removing the preset. Try closing the script and opening it up again"); 
    }
    mainWindow.close();
    $.evalFile(scriptLocation);
}

function applyMyPreset(){
  mainLayer.applyPreset(files[this.name]);
  mainWindow.close();
}

// ------------------- SAVE BUTTON -----------------------
mainWindow.separator = mainWindow.add ("panel");
mainWindow.separator.minimumSize.width = mainWindow.separator.maximumSize.width = 300;
 
var groupTwo = mainWindow.add("group", undefined, "Buttons");
groupTwo.orientation = "row";

var saveButton = groupTwo.add("button", undefined, "Save keyframes");
saveButton.minimumSize.width=220;

saveButton.onClick = function(){
    app.executeCommand(3075);
    mainWindow.close();
    $.evalFile(scriptLocation);
}

mainWindow.show();
