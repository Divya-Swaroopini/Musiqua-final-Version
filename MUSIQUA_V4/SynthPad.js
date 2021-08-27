//Oscillations – mathematically computed sounds

//create main synthpad functions

var SynthPad = (function() {
    // Variables
    var myCanvas;
    var frequencyLabel;
    var volumeLabel;
    var newAudioContext;
    var type;
    var gainNode;
    var oscillator;

  
    // Notes
    var lowNote = 261.63; // C4
    var highNote = 493.88; // B4
   

    // Constructor
    var SynthPad = function() 
    {
      myCanvas = document.getElementById('synth-pad');
      frequencyLabel = document.getElementById('frequency');
      volumeLabel = document.getElementById('volume');
    
      // Create a context.
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      newAudioContext = new window.AudioContext();
    
      SynthPad.setupEventListeners();
    };
    
    // Event Listeners are set up
    SynthPad.setupEventListeners = function() {
    
      myCanvas.addEventListener('mousedown', SynthPad.playSound);
      myCanvas.addEventListener('touchstart', SynthPad.playSound);
    
      myCanvas.addEventListener('mouseup', SynthPad.stopSound);
      document.addEventListener('mouseleave', SynthPad.stopSound);
      myCanvas.addEventListener('touchend', SynthPad.stopSound);
    };
    
    
    // Play a note by creating 
    SynthPad.playSound = function(event) {
      
      oscillator = newAudioContext.createOscillator();
      
      gainNode = newAudioContext.createGain();

      type = document.getElementById('waves').value;
    
      oscillator.type = type;

      gainNode.connect(newAudioContext.destination);
      oscillator.connect(gainNode);
    
      SynthPad.updateFrequency(event);
    
      oscillator.start(0);
    
      myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
      myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);
    
      myCanvas.addEventListener('mouseout', SynthPad.stopSound);
    };

    // Stop the audio.
    SynthPad.stopSound = function(event) {
      oscillator.stop(0);
    
      myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
      myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
      myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
    };
     

    // Calculate the note frequency.
    SynthPad.calculateNote = function(posX) {
      var noteDifference = highNote - lowNote;
      var noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
      return lowNote + noteOffset;
    };
    
    
    // Calculate the volume.
    SynthPad.calculateVolume = function(posY) {
      var volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
      return volumeLevel;
    };
    
    
    // Fetch the new frequency and volume.
    SynthPad.calculateFrequency = function(x, y) {
      var noteValue = SynthPad.calculateNote(x);
      var volumeValue = SynthPad.calculateVolume(y);
    
      oscillator.frequency.value = noteValue;
      gainNode.gain.value = volumeValue;
    
      frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
      volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
    };
    
    
    // Update the note frequency.
    SynthPad.updateFrequency = function(event) {
      if (event.type == 'mousedown' || event.type == 'mousemove') {
        SynthPad.calculateFrequency(event.x, event.y);
      } else if (event.type == 'touchstart' || event.type == 'touchmove') {
        var touch = event.touches[0];
        SynthPad.calculateFrequency(touch.pageX, touch.pageY);
      }
    };
    
    
    // Export SynthPad.
    return SynthPad;
  })();
  
  
  // Initialize the page.
  window.onload = function() {
    var synthPad = new SynthPad();
  }
  

