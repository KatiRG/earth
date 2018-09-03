var reader;
var progress = document.querySelector('.percent');
function abortRead() {  reader.abort(); }

function handleFileSelect(evt) {
  // Reset progress indicator on new file selection.
  progress.style.width = '0%';
  progress.textContent = '0%';

  reader = new FileReader();
  reader.onerror = errorHandler;
  reader.onprogress = updateProgress;
  reader.onabort = function(e) {
    alert('File read cancelled');
  };
  reader.onloadstart = function(e) {
    document.getElementById('progress_bar').className = 'loading';
  };
  reader.onload = function(e) {

    // Ensure that the progress bar displays 100% at the end.
    progress.style.width = '100%';
    progress.textContent = '100%';
    setTimeout("document.getElementById('progress_bar').className='';", 2000);
    //var reader = new NetCDFReader(reader.result);

    //replace reader with NetCDF reader
    reader = new netcdfjs(this.result);
    reader.getDataVariable('wmoId'); // go to offset and read it

   //... your program here  ..//

  }
  reader.readAsArrayBuffer(evt.target.files[0]);
}

// Make input element <input type="file" id="files" name="file" />
var input = document.createElement("input");
input.id='files'
input.type = "file";
input.className = "file"; 
document.body.appendChild(input); // put it into the DOM

// Make a Progress bar <div id="progress_bar"><div class="percent">0%</div></div>
var progress = document.createElement("div");
progress.id='progress_bar';
inner = document.createElement("div");
inner.className = "percent";
inner.id='innerdiv' // set the CSS class
progress.appendChild(inner);
document.body.appendChild(progress); // put it into the DOM

//Start event listener to check if a file has been selected
run = document.getElementById('files').addEventListener('change', handleFileSelect, false);

///Progress bar and other functions 
function errorHandler(evt) {
  switch(evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      alert('File Not Found!'); break;
    case evt.target.error.NOT_READABLE_ERR:
      alert('File is not readable');break;
    case evt.target.error.ABORT_ERR: break;
    default: alert('An error occurred reading this file.');
  };
}

function updateProgress(evt) {
  // evt is an ProgressEvent. Updates progress bar
  if (evt.lengthComputable) {
    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
      progress.style.width = percentLoaded + '%';
      progress.textContent = percentLoaded + '%';
    }
  }
}