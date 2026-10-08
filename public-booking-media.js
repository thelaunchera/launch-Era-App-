/* Public booking photography, distinct for homes and special requests. */
(()=>{
const demoPhotos={
        "book-residential":{
          hero:"https://images.pexels.com/photos/36729566/pexels-photo-36729566.jpeg?auto=compress&cs=tinysrgb&w=1400",
          summary:"https://images.pexels.com/photos/9462224/pexels-photo-9462224.jpeg?auto=compress&cs=tinysrgb&w=900",
          support:"https://images.pexels.com/photos/19889139/pexels-photo-19889139.jpeg?auto=compress&cs=tinysrgb&w=1200",
          heroAlt:"Professional cleaner in a bright residential home",
          summaryAlt:"Professional cleaner working in a residential kitchen",
          supportAlt:"Bright clean residential living room"
        },
        "book-commercial":{
          hero:"https://images.pexels.com/photos/33357392/pexels-photo-33357392.jpeg?auto=compress&cs=tinysrgb&w=1400",
          summary:"https://images.pexels.com/photos/36303748/pexels-photo-36303748.jpeg?auto=compress&cs=tinysrgb&w=900",
          support:"https://images.pexels.com/photos/10567236/pexels-photo-10567236.jpeg?auto=compress&cs=tinysrgb&w=1200",
          heroAlt:"Professional cleaners at a modern commercial building",
          summaryAlt:"Commercial cleaning cart in a business hallway",
          supportAlt:"Modern commercial workspace"
        },
        "quote-residential":{
          hero:"https://images.pexels.com/photos/6196692/pexels-photo-6196692.jpeg?auto=compress&cs=tinysrgb&w=1400",
          summary:"https://images.pexels.com/photos/4239128/pexels-photo-4239128.jpeg?auto=compress&cs=tinysrgb&w=900",
          support:"https://images.pexels.com/photos/5591909/pexels-photo-5591909.jpeg?auto=compress&cs=tinysrgb&w=1200",
          heroAlt:"Professional cleaners preparing a residential cleaning",
          summaryAlt:"Residential cleaner washing a bathroom fixture",
          supportAlt:"Cleaner wiping a residential kitchen counter"
        },
        "quote-commercial":{
          hero:"https://images.pexels.com/photos/8811390/pexels-photo-8811390.jpeg?auto=compress&cs=tinysrgb&w=1400",
          summary:"https://images.pexels.com/photos/34516664/pexels-photo-34516664.jpeg?auto=compress&cs=tinysrgb&w=900",
          support:"https://images.pexels.com/photos/18134199/pexels-photo-18134199.jpeg?auto=compress&cs=tinysrgb&w=1200",
          heroAlt:"Professional cleaner washing a commercial storefront window",
          summaryAlt:"Professional janitorial supplies for a commercial space",
          supportAlt:"Professional cleaners at a modern office building"
        }
      };
const bookingPropertyPhotos={
        residential:{
          hero:"https://images.pexels.com/photos/37184168/pexels-photo-37184168.jpeg?auto=compress&cs=tinysrgb&w=1600",
          heroAlt:"Bright and airy luxury residential living room with wide windows",
          summary:"https://images.pexels.com/photos/15242038/pexels-photo-15242038.jpeg?auto=compress&cs=tinysrgb&w=900",
          summaryAlt:"Modern residential living room interior"
        },
        commercial:{
          hero:"https://images.pexels.com/photos/7534224/pexels-photo-7534224.jpeg?auto=compress&cs=tinysrgb&w=1400",
          heroAlt:"Modern commercial office interior with no people",
          summary:"https://images.pexels.com/photos/6794918/pexels-photo-6794918.jpeg?auto=compress&cs=tinysrgb&w=900",
          summaryAlt:"Bright modern commercial office interior"
        },
        special:{
          hero:"https://images.pexels.com/photos/36777525/pexels-photo-36777525.jpeg?auto=compress&cs=tinysrgb&w=1600",
          heroAlt:"Bright upscale living room with modern architectural details",
          summary:"https://images.pexels.com/photos/15242038/pexels-photo-15242038.jpeg?auto=compress&cs=tinysrgb&w=900",
          summaryAlt:"Spacious modern home interior"
        },
        confirmation:{
          hero:"https://images.pexels.com/photos/7746083/pexels-photo-7746083.jpeg?auto=compress&cs=tinysrgb&w=1400",
          heroAlt:"Neutral clean modern hallway with no people"
        }
      };
window.TLE_BOOKING_MEDIA={demoPhotos,bookingPropertyPhotos};
})();
