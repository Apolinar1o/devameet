const chars = "0123456789abcdefghijklmopqrstuvwxyz"
const size = 12

 const linkGenerator = () => {
    let randomString = ""
    for( let i = 0; i < size ;i+1) {
         if(i == 5 || i == 10) {
            randomString += "-"
            console.log(i)

         }
         console.log(i)
    }
}

linkGenerator()
