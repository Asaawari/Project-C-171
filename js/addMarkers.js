AFRAME.registerComponent("create-markers", {
  
  init: async function(){
    var mainScene = document.querySelector('#main-scene')
    var toys = await this.getToys()
    toys.map(toy=>{
      // marker
      var marker = document.createElement("a-marker")
      marker.setAttribute("id", toy.id)
      marker.setAttribute("type", "pattern")
      marker.setAttribute("url", toy.marker_pattern_url)
      marker.setAttribute("cursor", {rayOrigin: "mouse"})
      marker.setAttribute("markerhandler", {})
      mainScene.appendChild(marker)
      
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
      if (!toy.is_out_of_stock_days.includes(days[todays_day])){
       // model
        var model = document.createElement("a-entity")
        model.setAttribute("id", `model-${toy.id}`)
        model.setAttribute("position", toy.model_geometry.position)
        model.setAttribute("rotation", toy.model_geometry.rotation)
        model.setAttribute("scale", toy.model_geometry.scale)
        model.setAttribute("gltf-model", `url(${toy.model_url})`)
        model.setAttribute("gesture-handler", {})
        model.setAttribute("visible", false)
        console.log(toy.model_url)
        marker.appendChild(model)
  
        // description
        var mainPlane = document.createElement("a-plane")
        mainPlane.setAttribute("id", `main-plane-${toy.id}`)
        mainPlane.setAttribute("position", {x:0,y:0,z:0})
        mainPlane.setAttribute("rotation", {x:-90,y:0,z:0})
        mainPlane.setAttribute("width", 1.7)
        mainPlane.setAttribute("height", 1.5)
        mainPlane.setAttribute("visible", false)
        marker.appendChild(mainPlane)
  
        // toy title, background plane
        var titlePlane = document.createElement("a-plane")
        titlePlane.setAttribute("id", `title-plane-${toy.id}`)
        titlePlane.setAttribute("position", {x:0,y:0.89,z:0.02})
        titlePlane.setAttribute("rotation", {x:0,y:0,z:0})
        titlePlane.setAttribute("width", 1.69)
        titlePlane.setAttribute("height", 0.3)
        titlePlane.setAttribute("material", {color:"blue"})
        mainPlane.appendChild(titlePlane)
  
        var toyTitle = document.createElement("a-entity")
        toyTitle.setAttribute("id", `toy-title-${toy.id}`)
        toyTitle.setAttribute("position", {x:0,y:0,z:0.1})
        toyTitle.setAttribute("rotation", {x:0,y:0,z:0})
        toyTitle.setAttribute("text", {
          font: "monoid", 
          color:"black", 
          width:1.8,
          height:1,
          align: "center",
          value: toy.toy_name.toUpperCase()
        })
        titlePlane.appendChild(toyTitle)
  
        var description = document.createElement("a-entity")
        description.setAttribute("id", `description-${toy.id}`)
        description.setAttribute("position", {x:0.3,y:0,z:0.1})
        description.setAttribute("rotation", {x:0,y:0,z:0})
        description.setAttribute("text", {
          font: "monoid", 
          color:"black", 
          width:2,
          align: "left",
          value: `${toy.description.join("\n\n")}`
        })
        mainPlane.appendChild(description)
 
        var pricePlane = document.createElement("a-image")
        pricePlane.setAttribute("id", `price-plane-${toy.id}`)
        pricePlane.setAttribute("src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png")
        pricePlane.setAttribute("width", 0.8)
        pricePlane.setAttribute("height", 0.8)
        pricePlane.setAttribute("position", {x: 1.3, y: 0, z: 0.3})
        pricePlane.setAttribute("rotation", {x: -90, y: 0, z: 0})
        pricePlane.setAttribute("visible", false)
  
        var price = document.createElement("a-entity")
        price.setAttribute("id", `price-${toy.id}`)
        price.setAttribute("position", {x: -0.03, y: 0.05, z: 0.1})
        price.setAttribute("rotation", {x: 0, y: 0, z: 0})
        price.setAttribute("text", {
          font: "mozillavr", 
          color:"white", 
          width:3,
          align: "center",
          value: `Only \n $ ${toy.price}`
        })
        pricePlane.appendChild(price)
        marker.appendChild(pricePlane)
      }
    })
  },

  getToys:async function(){
    return await firebase.firestore().collection("toys").get()
    .then(snap=>{
      return snap.docs.map(doc=>doc.data())
    })
  }
  
  });
