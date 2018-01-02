var mainComp = app.project.activeItem;
var mainLayer = mainComp.layer(1);
var mainWindow = new Window("palette", "KF Console", undefined);

var presetFolder =  File('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ 2017\\Support\ Files\\Presets\\AnimationMaster');
//todo can't hardcore folder names into the script so either go through everypossible option or let user choose or whatever
var  files = new Array();
files = presetFolder.getFiles ("*.ffx");
var bsize = [0,0,30,40];

for(i = 0; i < files.length; i++){
    var myButtonGroup = mainWindow.add("group");
    var supername = String(files[i]);
    var startPosition = supername.lastIndexOf( "/" ) ;
    //todo shows the shortcut word isntead  of the fucking SC
    var shortCutFile = File('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ 2017\\Support\ Files\\Presets\\AnimationMaster\\shortcuts.txt');

    var buttonX = myButtonGroup.add("button", undefined, supername.substring(startPosition+1, supername.length -4));
    var buttonRename = myButtonGroup.add("button",bsize,"RN");
    var buttonDel = myButtonGroup.add("button",undefined,"⃠");
    buttonDel.name=i;
    buttonDel.onClick=deleteMyPreset;
    buttonRename.name=i;
    buttonRename.onClick=renamePreset;
    buttonX.name= i;
    buttonX.onClick=applyMyPreset;
    var buttonShortcut = myButtonGroup.add("button",undefined,"GG");
    
            if (shortCutFile.exists){  
                
                shortCutFile.open('r', undefined, undefined);
                var content = shortCutFile.read();
                var lines = content.split('\n');
                for (j = 0; j < lines.length-1; j++){
                    var shortcutName = lines[j].slice(lines[j].lastIndexOf("/") + 1 ,lines[j].length-5);
                    var shortcutButtonName = buttonX.name.toString().slice(buttonX.name.toString().lastIndexOf("/") + 1 ,buttonX.name.toString().length-4) // FUCK IS THIS
                    alert("hello " + shortcutName+ " " + shortcutButtonName);
                      if (shortcutName == shortcutButtonName) { 
                          alert("hello");
                            buttonShortcut = myButtonGroup.add("button",undefined,"GG");
                     }
                }
                shortCutFile.close();
        }else{
            buttonShortcut = myButtonGroup.add("button",undefined,"SC");
        }
    
        buttonShortcut.name=i;
        buttonShortcut.onClick=assignShortcut;
};

mainWindow.addEventListener ("keydown", function (k){shortCut(k)});
function shortCut (k){
    var shortCutFile = File('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ 2017\\Support\ Files\\Presets\\AnimationMaster\\shortcuts.txt');
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

function renamePreset(){
    //todo vaata et ei ole juba sama nimega faile olemas
    //todo vaata et sisestatav edittext oleks highlightitud
    //todo vaata et sisestatava edittexti lahter oleks suurem
    //todo kui vajutad ented siis koheselet saadab selle asja minema
    //todo parsi tühikud nii et nad ei annaks kahtlast %20 
    var buttonName = files[this.name];
    var box = new Window('dialog');  
    box.panel = box.add('panel', undefined, "New Name");  
    box.panel_text1 = box.panel.add('edittext', undefined, "");  
    var buttonRe = box.add("button",undefined,"Save");
    buttonRe.onClick=renameP;

    function renameP(){
        buttonName.rename(box.panel_text1.text + ".ffx");
        box.close();
    }
    box.show();
}

function assignShortcut(){
    var box = new Window('dialog');  
    var buttonName = files[this.name];
    box.addEventListener ("keydown", function (kd) {pressed (kd)});
    
    function pressed (k) {
        var shortCutFile = File('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ 2017\\Support\ Files\\Presets\\AnimationMaster\\shortcuts.txt');
        
        if (!shortCutFile.exists){  
            shortCutFile = new File ('C:\\Program\ Files\\Adobe\\Adobe\ After\ Effects\ CC\ 2017\\Support\ Files\\Presets\\AnimationMaster\\shortcuts.txt');
            shortCutFile.open('w');
            shortCutFile.write(buttonName.toString() + k.keyName + '\n');
            shortCutFile.close();
            alert("created a new file");
         }else{
            shortCutFile.open('a');
            var content = shortCutFile.read();
            var lines = content.split('\n');
            var presentButtonName = buttonName.toString().slice(buttonName.toString().lastIndexOf("/") + 1 ,buttonName.toString().length-4);            
            //alert("before for loop + " + lines.length);
            for (j = 0; j < lines.length-1; j++) {
                //alert("am for looping");
                
                var presetNameInFile = lines[j].slice(lines[j].lastIndexOf("/") + 1 ,lines[j].length-5);
                //alert (presetNameInFile + " " + presentButtonName);
                if (presetNameInFile == presentButtonName){
                    lines[j] = "WUT";
                    shortCutFile.writeln(buttonName.toString() + k.keyName);
                    alert("found existing one and replaced");
                    //shortCutFile.close();
                    box.close();
                }
                else if (k.keyName == lines[j].slice(-1)){
                    alert("Shortcut already in use by " + presetNameInFile); 
                    //shortCutFile.close();
                    box.close();
                }
            }
        
            shortCutFile.open('a');
            shortCutFile.writeln(buttonName.toString() + k.keyName);
            alert("made new shortcut");
            shortCutFile.close();
         }
       //todo refreshes the mainwindow shit so it would show the new button name
       box.close();
    }
    box.panel = box.add('panel', undefined, "Press the button on the keyboard that you wish to use as a shortcut");  
    box.show();
}

function deleteMyPreset(){
    var MyFile = files[this.name];
    if (MyFile.exists){  
            //MyFile.remove();  
            alert("removed");
            mainWindow.remove(myButtonGroup); //TODO UPDATEB LIHTSALT ASJA
            //todo also remove the shortcut from text file if there is one
    }else{
            alert("There's an error with removing the preset. Try closing this window and opening it up again"); 
    } 
}

function applyMyPreset(){
  mainLayer.applyPreset(files[this.name]);
  mainWindow.close();
}

var groupTwo = mainWindow.add("group", undefined, "Buttons");
groupTwo.orientation = "row";

var saveButton = groupTwo.add("button", undefined, "Save keyframes");
//saveButton.graphics.foregroundColor = saveButton.graphics.newBrush(saveButton.graphics.BrushType.SOLID_COLOR,[0.5,0.5,0.5]);

saveButton.onClick = function(){
    app.executeCommand(3075);
}

mainWindow.show();