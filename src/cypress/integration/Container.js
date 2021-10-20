let a = "Container";
let b = 123;
let c = false;

console.log(a)
console.log(b)
console.log(c)

if (c) {
  console.log("AAAA")
} else {
  console.log("BBB")
}


let person = {
  name: "Ruben",
  age: 14
}

console.log(person)
console.log(person.name)


console.log("----------------")
let addressBook = [
  {
  name: "Ruben",
  age: 14
},
{
  name: "Liana",
  age: 13
}
]

for(let p of addressBook)
{
  console.log(p.name)
  console.log(p.age)
}



///


let addressBook = [
    {
      name: "Ruben",
      age: 14,
      isEmployed: true
    },
    {
      name: "Liana",
      age: 13,
      isEmployed: true
    } 
  ]
  
  for(let p of addressBook)
  {
    console.log(`${p.name}, age: ${p.age}`)
    if (p.isEmployed) {
      console.log(`  ${p.name} is now busy.`)
    }
  }