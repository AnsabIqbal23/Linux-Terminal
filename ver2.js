// Select the input field and display container
const inputField = document.getElementById('user-input');
const displayContainer = document.getElementById('display');

// Listen for keyup event on input field
inputField.addEventListener('keyup', function (event) {
    // Check if Enter key is pressed (keyCode 13)
    if (event.keyCode === 13) {
        // Retrieve user input
        const userInput = inputField.value.trim();

        // Display user input in the container
        if (userInput !== '') {
            // Create a new paragraph element
            const paragraph = document.createElement('p');

            // Set the text content to user input
            paragraph.textContent = userInput;

            // Append the paragraph to the display container
            displayContainer.appendChild(paragraph);

            if (userInput.indexOf("echo ") !== -1) {
                find(userInput);
            }
            else if (userInput.indexOf("gedit ") !== -1) {
                geditFunction(userInput);
            } else if (userInput.indexOf("clear") !== -1) {
                clearFunction(userInput);
            } else if (userInput.indexOf("rm ") !== -1) {
                removeFunction(userInput);
            } else if (userInput.indexOf("run ") !== -1) {
                runCode(userInput);
            } else if (userInput.indexOf("gcc ") !== -1 || userInput.indexOf("g++ ") !== -1) {
                gcc(userInput);
            } else if (userInput.indexOf("./") !== -1) {
                outputCompiled(userInput);
            } else {
                const paragraph2 = document.createElement('p');
                paragraph2.textContent = "[unidentified command!]";
                paragraph2.classList.add('error-info');
                displayContainer.appendChild(paragraph2);
                addSpace();
            }

            // Clear the input field
            inputField.value = '';
        }
    }
});

function addSpace() {
    const paragraph2 = document.createElement('p');
    paragraph2.textContent = "";
    paragraph2.classList.add('newLine');
    displayContainer.appendChild(paragraph2);
}

let fileInfo = [];
let fileName = [];
let index = 0;

function push(_fileInfo, _fname) {
    if (findAlreadyExists(_fname) !== -1) {
        fileInfo[findAlreadyExists(_fname)] = _fileInfo;
    } else {
        fileInfo[index] = _fileInfo;
        fileName[index] = _fname;
        index++;
    }
}

function printQueue() {
    alert(fileInfo[index - 1]);
}

function pop() {
    index--;
}

function findIfCorrect(_userInput, whatToCheck, ft1, ft2, ft3) {
    if (_userInput.indexOf(whatToCheck) == 0) {
        if ((_userInput.indexOf(whatToCheck) + whatToCheck.length) !== _userInput.length) {
            let temp = _userInput.replace(whatToCheck, '');
            if (temp.indexOf(ft1) !== -1 || temp.indexOf(ft2) !== -1 || temp.indexOf(ft3) !== -1) {
                if (((temp.indexOf(ft1) + ft1.length) == temp.length) || ((temp.indexOf(ft2) + ft2.length) == temp.length) || ((temp.indexOf(ft3) + ft3.length) == temp.length)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function find(usInp) {
    if (findIfCorrect(usInp, 'echo', '.txt', '.c', '.cpp')) {

        //find if the text file exists in the database
        var t = usInp.replace('echo ', '');
        for (i = 0; i < index; i++) {
            if (fileName[i] == t) {
                const paragraph2 = document.createElement('p');
                const fileInfoWithBreaks = fileInfo[i].replace(/\n/g, '<br>');
                paragraph2.innerHTML = fileInfoWithBreaks;
                paragraph2.classList.add('add-info');
                displayContainer.appendChild(paragraph2);
                addSpace();
                return;
            }
        }
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = usInp + " file not found!";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    } else {
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = "[unidentified syntax of echo!]";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    }
}

function clickFunction() {
    //making the compiler usable again
    document.getElementById("user-input").disabled = false;
    document.getElementById("user-input").placeholder = "Type here...";

    //making the text-editor un-usable
    document.getElementById("editor-user-input").disabled = true;
    let temp = document.getElementById("editor-user-input").value;
    document.getElementById("editor-user-input").value = "";

    //pushing data onto array to save record
    push(temp, document.getElementById("op").innerHTML);

    //making the text-editor show "nothing" is opened
    document.getElementById("op").innerHTML = "Nothing";
}

//check if the file already exists, already created before
function findAlreadyExists(_txtFile) {
    for (i = 0; i < index; i++) {
        if (fileName[i] == _txtFile) {
            return i;
        }
    }
    return -1;
}

function geditFunction(usInp) {
    if (findIfCorrect(usInp, 'gedit ', '.txt', '.c', '.cpp')) {
        var txtfile = usInp.replace('gedit ', '');

        if (findAlreadyExists(txtfile) !== -1) {
            //if a file already exists, then put it's data onto the text editor
            document.getElementById("editor-user-input").value = fileInfo[findAlreadyExists(txtfile)];
        }

        //disable the compiler from taking furhter inputs
        document.getElementById("user-input").disabled = true;
        document.getElementById("user-input").placeholder = "";

        //display "write something on editor" on the compiler
        let paragraph2 = document.createElement('p');
        paragraph2.textContent = "[write something on editor...]";
        paragraph2.classList.add('add-info');
        displayContainer.appendChild(paragraph2);
        addSpace();

        //make the editor open for information
        document.getElementById("editor-user-input").disabled = false;
        //write the name of the file we're working on, as "currently opened"
        document.getElementById("op").innerHTML = txtfile;
    } else {
        //invalid "gedit" syntax being output to the terminal
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = "[unidentified syntax of gedit!]";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    }
};

function clearFunction(usInp) {
    //if "clear" is the first thing written AND "clear" is the only thing written
    if (usInp.indexOf("clear") == 0 && ((usInp.indexOf("clear") + 5) == usInp.length)) {
        while (displayContainer.firstChild) {
            displayContainer.removeChild(displayContainer.firstChild);
        }
    } else {
        //invalid "clear" syntax being output to the terminal
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = "[unidentified syntax of clear!]";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    }
}

function removeFunction(_userInput) {
    if (findIfCorrect(_userInput, "rm ", ".txt", ".cpp", ".c")) {
        let _txtFile = _userInput.replace('rm ', '');
        let _indexToDelete = findAlreadyExists(_txtFile);
        if (_indexToDelete !== -1) {
            fileInfo.splice(_indexToDelete, 1);
            fileName.splice(_indexToDelete, 1);
            pop();
            const paragraph2 = document.createElement('p');
            paragraph2.textContent = _txtFile + " sucessfully deleted";
            paragraph2.classList.add('add-info');
            displayContainer.appendChild(paragraph2);
            addSpace();
        } else {
            //the text file we want to delete does not exist
            const paragraph2 = document.createElement('p');
            paragraph2.textContent = "[the text file " + _txtFile + " does not exist!]";
            paragraph2.classList.add('error-info');
            displayContainer.appendChild(paragraph2);
            addSpace();
        }
    } else {
        //invalid "rm" syntax being output to the terminal
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = "[unidentified syntax of rm!]";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    }
}

let compiledFileNames = [];
let compileObjects = [];
let compiledOutput = [];
let index2 = 0;

function pushToCompiledFiles(_code, _output) {
    for (i = 0; i < index; i++) {
        if (fileInfo[i] == _code) {
            let fname = fileName[i];
            for (j = 0; j < index2; j++) {
                if (fname == compiledFileNames[j]) {
                    compiledOutput[j] = _output;
                }
            }
        }
    }
}

function pushNames(_fname, _obname) {
    compiledFileNames[index2] = _fname;
    compileObjects[index2] = _obname;
    index2++;
}

function getFileNameFor(_outputname) {
    for (i = 0; i < index2; i++) {
        if (compileObjects[i] == _outputname) {
            return compiledFileNames[i];
        }
    }
    return -1;
}

function gcc(_userInput) {
    if (_userInput.indexOf("gcc ") == 0 || _userInput.indexOf("g++ ") == 0) {
        _userInput = _userInput.slice(4, _userInput.length);
        let _fname = '';
        if (_userInput.indexOf(".cpp") !== -1) {
            _fname = _userInput.slice(0, (_userInput.indexOf(".cpp") + 4));
        } else {
            _fname = _userInput.slice(0, (_userInput.indexOf(".c") + 2));
        }
        let _outputName = _userInput.slice((_userInput.indexOf("-o") + 3), _userInput.length);
        pushNames(_fname, _outputName);
        console.log(_fname, _outputName);
    }
}

async function outputCompiled(_userInput) {
    if (_userInput.indexOf("./") == 0) {
        let end = _userInput.indexOf(" ");
        let inputvals = '';
        if (end == -1) {
            end = _userInput.length;
        }
        let _outputname = _userInput.slice(2, end);
        if (end !== -1) {
            inputvals = _userInput.slice(end + 1, _userInput.length);
        }

        let fname = getFileNameFor(_outputname);
        let found = false;
        for (j = 0; j < index; j++) {
            //console.log("comparing " + fileName[j] + " and " + fname);
            if (fileName[j] == fname) {
                console.log("sending vals [" + inputvals + "] for file " + fileName[j]);
                let x = await compileCode(fileInfo[j], inputvals);
                found = true;
            }
        }

        found = false;
        for (i = 0; i < index2; i++) {
            //console.log("comparing " + compileObjects[i] + " and " + _outputname);
            if (compileObjects[i] == _outputname) {
                let output = compiledOutput[i];
                found = true;
                if (output.error == '') {
                    let paragraph2 = document.createElement('p');
                    paragraph2.textContent = output.stdout;
                    paragraph2.classList.add('add-info');
                    displayContainer.appendChild(paragraph2);
                    addSpace();
                } else {
                    let paragraph = document.createElement('p');
                    paragraph.textContent = output.stderr;
                    paragraph.classList.add('error-info');
                    displayContainer.appendChild(paragraph);

                    let paragraph2 = document.createElement('p');
                    paragraph2.textContent = output.error;
                    paragraph2.classList.add('error-info');
                    displayContainer.appendChild(paragraph2);
                    addSpace();
                }
                break;
            }
        }
        if (!found) {
            let paragraph = document.createElement('p');
            paragraph.textContent = "could not find object file with the name " + _outputname;
            paragraph.classList.add('error-info');
            displayContainer.appendChild(paragraph);
            addSpace();
        }
    }
}

function runCode(_userInput) {
    if (_userInput.indexOf("run") == 0) {
        let _fileName = _userInput.replace('run ', '');
        let _idx = findAlreadyExists(_fileName);
        if (_idx != -1) {
            compileCode(fileInfo[_idx], '');
        }
    }
}

async function compileCode(_code, _stdin) {
    try {
        const token = 'Please Enter Your API Key After Signing up on glot.io';
        const language = 'cpp'; // Language is always C++
        const code = _code; // Get the code content from fileInfo
        const fileName = 'code.cpp';
        const stdin = _stdin;
        const response = await axios.post('http://localhost:3000/runcode', {  // Update the URL
            token,
            language,
            fileName,
            code,
            stdin
        });
        pushToCompiledFiles(_code, response.data);
        // Handle the response from the backend
        // if (response.data.error == ''){
        //     let paragraph2 = document.createElement('p');
        //     paragraph2.textContent = response.data.stdout;
        //     paragraph2.classList.add('add-info');
        //     displayContainer.appendChild(paragraph2);
        //     addSpace();
        // } else {
        //     let paragraph = document.createElement('p');
        //     paragraph.textContent = response.data.stderr;
        //     paragraph.classList.add('error-info');
        //     displayContainer.appendChild(paragraph);

        //     let paragraph2 = document.createElement('p');
        //     paragraph2.textContent = response.data.error;
        //     paragraph2.classList.add('error-info');
        //     displayContainer.appendChild(paragraph2);
        //     addSpace();
        // }
        console.log(response.data);
        return 1;
    } catch (error) {
        console.error('Error sending code to backend:', error);
    }
}
