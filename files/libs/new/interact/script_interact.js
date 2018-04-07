  interact('.only-drag')
  .draggable({
    onmove: window.dragMoveListener
  });


  interact('.resize-drag')
  .draggable({
    onmove: window.dragMoveListener
  })
  .resizable({
    preserveAspectRatio: true,
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function (event) {
    /*
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    //target.textContent = Math.round(event.rect.width) + '�' + Math.round(event.rect.height);
    */
  });


  var All_Elements_Dragged = [];
  var All_Id_Elements_Dragged = [];

  function dragMoveListener_ (event) {
    //$(".boutons_enregistrer_positionnement").fadeIn("slow");
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    if(All_Id_Elements_Dragged.indexOf(event.target.id) <0){
      All_Id_Elements_Dragged[All_Id_Elements_Dragged.length] = event.target.id;
        var element_dragged = {'id':event.target.id,'x':x,'y':y};
      All_Elements_Dragged[All_Elements_Dragged.length] = element_dragged;
    }

    All_Elements_Dragged[All_Id_Elements_Dragged.indexOf(event.target.id)].x = x;
    All_Elements_Dragged[All_Id_Elements_Dragged.indexOf(event.target.id)].y = y;

	  //target.innerHTML = "x = "+x+"  y = "+y;
  }
  function SetPosition (object) {
    for(var id in object){
      var element = object[id];
      var target = document.getElementById(element.id);
      // keep the dragged position in the data-x/data-y attributes
        x = element.x,
        y = element.y;

      // translate the element
      target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    //$(".Loader_Principal_Accueil").fadeOut("slow");
    //target.innerHTML = "x = "+x+"  y = "+y;
  }

  function SetSinglePosition (object,x,y) {
    var element = object;
    var target = document.getElementById(element.id);
      // keep the dragged position in the data-x/data-y attributes
       // x = element.x,
       // y = element.y;

      // translate the element
      target.style.webkitTransform =
      target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

    //$(".Loader_Principal_Accueil").fadeOut("slow");
    //target.innerHTML = "x = "+x+"  y = "+y;
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;


// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    
    if(All_Id_Elements_Dragged.indexOf(event.target.id) <0){
      All_Id_Elements_Dragged[All_Id_Elements_Dragged.length] = event.target.id;
        var element_dragged = {'id':event.target.id,'x':x,'y':y};
      All_Elements_Dragged[All_Elements_Dragged.length] = element_dragged;
    }

    All_Elements_Dragged[All_Id_Elements_Dragged.indexOf(event.target.id)].x = x;
    All_Elements_Dragged[All_Id_Elements_Dragged.indexOf(event.target.id)].y = y;
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;
  
  // enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '#yes-drop',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    draggableElement.textContent = 'Dragged in';
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    event.relatedTarget.textContent = 'Dragged out';
  },
  ondrop: function (event) {
    event.relatedTarget.textContent = 'Dropped';
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});