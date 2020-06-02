var map;
var markers=[];
var infoWindow;

function initMap() {
  var losAngeles= {
    lat :34.063380,
    lng : -118.358080
  } 
  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 8
  });
  infoWindow = new google.maps.InfoWindow();

  onSearch();
  
}


function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}


function onSearch(){
  var foundStore=[];
  var zipcode = document.getElementById('zip-code-input').value
  // console.log(zipcode) 
  if(zipcode){
    stores.forEach(function(store){
      var postal = store.address.postalCode.substring(0,5);
      // console.log(postal)
      if(postal===zipcode){
        foundStore.push(store);
      }
  
    });
  }
  else{
    foundStore= stores;
  }
  clearLocations()
  displayStores(foundStore)
  showStoreMarkers(foundStore)
  setonClickListener();

}
function setonClickListener(){
  var storeElement = document.querySelectorAll('.store-container');
  storeElement.forEach(function(elem,index){
    elem.addEventListener('click',function(){
      google.maps.event.trigger(markers[index],'click')
    })
  })
}


function displayStores(stores){
  var storeHtml="";
  stores.forEach(function(store,index){
    var address = store.addressLines;
    var phone = store.phoneNumber;
    storeHtml +=`
        <div class="store-container">
          <div class="store-container-background">
            <div class="store-info-container">
              
              <div class="store-address">
                <span>${address[0]}</span>
                <span>${address[1]}</span>
              </div>
              <div class="store-phone-number">
                  ${phone}
              </div>          
            </div>    
            <div class="store-number-container">
              <div class="store-number">
                ${index+1}                  
              </div>
            </div>
          </div>
        </div>
    `
  })   
  document.querySelector('.stores-list').innerHTML= storeHtml
}

function showStoreMarkers(stores){
  var bounds = new google.maps.LatLngBounds();
  stores.forEach(function(store,index){
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude);
    var address= store.addressLines[0];
    var name = store.name;
    var statusText = store.openStatusText;
    var phone = store.phoneNumber;
    bounds.extend(latlng);// add new values for new locator to get in a close view

    createMarker(latlng,name,address,statusText,phone,index)
  })
  map.fitBounds(bounds);

}

function createMarker(latlng, name, address,statusText,phone,index) {
  var html =`
    <div class="store-info-window">
      <div class="store-info-name"> ${name}</div>
      <div class="store-info-status">${statusText}</div>
      <div class="store-info-address"><div class="circle"><i class="fas fa-location-arrow"></i></div>${address}</div>
      <div class="store-info-phone"><div class="circle"><i class="fas fa-phone-alt"></i></div> ${phone}</div>
    </div>
  
  `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label:`${index+1}`
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
