var tablenumber = null

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var toys = await this.getToys();

    this.el.addEventListener("markerFound", () => {     
        this.handleMarkerFound();
     });

    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });

  },
  handleMarkerFound: function () {
    var todays_date = new Date()
    var todays_day = todays_date.getDay()
    var days = [
      "Sunday", 
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
    var toy = toys.filter(toy=>toy.id === markerId)[0]

    var model = document.querySelector(`#model-${toy.id}`)
    model.setAttribute("visible", true)

    var descriptionContainer = document.querySelector(`#main-plane-${toy.id}`)
    descriptionContainer.setAttribute("visible", true)

    var pricePlane = document.querySelector(`#price-plane-${toy.id}`)
    pricePlane.setAttribute("visible", true)

    console.log(todays_day)
    if (toy.is_out_of_stock_days.includes(days[todays_day])){
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This toy is not available today", 
        timer: 2500,
        buttons: false
      })
    }else{
      var toy = toys.filter(toy => toy.id === markerId)[0];

      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);

      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";

      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");

      // Handling Click Events
      ratingButton.addEventListener("click", function () {
        swal({
          icon: "warning",
          title: "Rate Toy",
          text: "Work In Progress"
        });
      });

      orderButtton.addEventListener("click", () => {
        var tNumber;
        tablenumber<=9?(tNumber=`T0${tablenumber}`):`T${tablenumber}`
        this.handleOrder(tNumber, toy)
        swal({
          icon: "https://i.imgur.com/4NZ6uLY.jpg",
          title: "Thanks For Your Order !",
          text: "Your order will reach you soon!"
        });
      });
    }    
  },

  handleOrder: function(user, toy){
    firebase.firestore().collection('tables').doc(tNumber).get()
    .then(doc=>{
      console.log(details)
      var details = doc.data()
      if (details["current_orders"][toy.id]){
        details["current_orders"][toy.id]["quantity"] += 1
        var current_quantity = details["current_orders"][toy.id]["quantity"]
        details["current_orders"][toy.id]["subtotal"] = current_quantity * toy.price
      }else{
        details["current_orders"][toy.id] = 
          {item: toy.toy_name,
          price: toy.price,
          quantity: 1,
          subtotal: toy.price*1}
      }
    details["current_orders"].total_bill += toy.price; 
    firebase.firestore().collection("users").doc(doc.id).update(details)
    })
  },

  handleMarkerLost: function () {
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },
  //get the toys collection from firestore database
  getToys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  }
});
