
// 💯 flexible localStorage hook


import * as React from 'react'


function useLocalStorageState(
  key,
  defaultValue = '',
  // the = {} fixes the error we would get from destructuring when no argument was passed
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  ///////////////////////////
  //set the state value start
  ///////////////////////////
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      // the try/catch is here in case the localStorage value was set before
      // we had the serialization in place (like we do in previous extra credits)
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    //if the if "condition's value" does not fulfill then this return works
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })
  ////////////////////////////
  //set the state value finish
  ////////////////////////////

  //⭐⭐ if the key change that means.
  /*
  suppose ami atokhon name key te amr value save kortecilam
  but akhn ami chaiteci j ami genderName key te amr data set korbo
  then next step
   */
  const prevKeyRef = React.useRef(key)  //aita present key mean name jeta age cilo oitare reference korbe apatoto
  /*
  useRef re rendr kore na. so aita condition check korar time a ,
  render hobe na and previouse key and present key different thakbe
   */


  React.useEffect(() => {
    const prevKey = prevKeyRef.current //current a value ta thake
    if (prevKey !== key) {
      /*
      now,logic check ==
      prevKey hocce name and new key hocce genderName(suppose)
      so bojha jaitice j amra r name a ai value set korbo na
      so now, amra ager key mane name ta delete kore dibo. so er
      sob value soho aita delete hoye jabe
       */
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key //then prevKeyRef a new key mane genderName set korlam
    window.localStorage.setItem(key, serialize(state))
    /*
    ⬆⬆ ai line a main function mane Greeting theke asha setName er value genderName a save kore dilam
     */
  }, [key, state, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App

