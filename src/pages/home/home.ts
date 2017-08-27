import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase , FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';


declare var google;
declare var latitude;
declare var longitude;

export  interface GPS
{
  latitude:string;
  longitude:string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker:any;
  
  
  constructor(public afd:AngularFireDatabase,private geolocation: Geolocation, public navCtrl: NavController) {

  }

  initMap() {

    const image = {
      url: 'file:///android_asset/www/assets/icon/car.png',
      size: {
        width: 24,
        height: 24
      }
    };
    

    this.geolocation.getCurrentPosition().then((position) => {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log("Latitude"+latitude);
      console.log("Longitude"+longitude);
      //longitude = this.firebaseProvider.getLongitude();
      //console.log("Longitude"+longitude);
      let latLng = new google.maps.LatLng(latitude, longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,     
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }



      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);     
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'file:///android_asset/www/assets/icon/car.png'        
          
        }
		 });
    });
  }

  addInfoWindow(marker, content) {
    
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
    
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        });
    
      }
    

  showMyLocation() 
  {
    console.log("showmylocation");
   
    this.geolocation.getCurrentPosition().then((position) => {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log("Latitude"+latitude);
      console.log("Longitude"+longitude);
      let latLng = new google.maps.LatLng(latitude, longitude);  
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        animation: google.maps.Animation.DROP,
      });
    });
  }    



  clearMarkers()
  {
    //this.marker.setMap(null);
  }


  addMarker(location)
  {
     this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
  }

  getMyLocation()
  {
    this.clearMarkers();
    var ref = this.afd.database.ref('/cabs/cabs1/geolocation');
    ref.on("value", (snapshot) =>   {
      var test = snapshot.val();
        console.log("Latitude"+test.latitude);
        let latLng = new google.maps.LatLng(test.latitude, test.longitude);  
        this.addMarker(latLng);
       
    });


  }


  ionViewDidLoad(){
    this.initMap();
  }
}
