const chars = "0123456789abcdefghijklmopqrstuvwxyz"
const size = 12

 export const linkGenerator = () => {
    let randomString = ""
    for( let i = 0; i < size ;i++) {
         let rnumber = Math.floor(Math.random() * 34)
         if(i == 3 || i == 8) {
            randomString += "-"

         } else {
            randomString += chars[rnumber]
         }       
       
              
}
      return randomString                   
 }

