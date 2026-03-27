/**
 * 🚂 IRCTC Train Ticket Booking - async/await
 *
 * IRCTC pe train ticket book karna India ka sabse mushkil kaam hai! Lekin
 * async/await se yeh kaam asan ho jaata hai. Simulate karo API calls ko
 * async functions se — seat check karo, ticket book karo, cancel karo,
 * aur status check karo. Sab kuch await se sequentially hoga.
 *
 * Function: checkSeatAvailability(trainNumber, date, classType)
 *   - async function, returns a Promise
 *   - Simulates API call with a small delay (~100ms)
 *   - Validates trainNumber: must be a string of exactly 5 digits (e.g., "12345")
 *   - Validates classType: must be one of "SL", "3A", "2A", "1A"
 *   - Validates date: must be a non-empty string
 *   - If invalid trainNumber: throws Error "Invalid train number! 5 digit hona chahiye."
 *   - If invalid classType: throws Error "Invalid class type!"
 *   - If invalid date: throws Error "Date required hai!"
 *   - If valid: returns {
 *       trainNumber, date, classType,
 *       available: true/false (randomly, ~70% chance true),
 *       seats: random number 0-50,
 *       waitlist: random number 0-20
 *     }
 *   - If seats > 0, available = true; if seats === 0, available = false
 *
 * Function: bookTicket(passenger, trainNumber, date, classType)
 *   - async function
 *   - passenger is { name, age, gender } object
 *   - Validates passenger has name, age, gender
 *   - Awaits checkSeatAvailability(trainNumber, date, classType)
 *   - If available: returns {
 *       pnr: "PNR" + Math.floor(Math.random() * 1000000),
 *       passenger, trainNumber, date,
 *       class: classType,
 *       status: "confirmed",
 *       fare: calculated (SL:250, 3A:800, 2A:1200, 1A:2000)
 *     }
 *   - If not available: returns with status: "waitlisted", waitlistNumber: random 1-20
 *
 * Function: cancelTicket(pnr)
 *   - async function
 *   - Simulates cancellation with small delay
 *   - Validates pnr: must be a non-empty string starting with "PNR"
 *   - If invalid: throws Error "Invalid PNR number!"
 *   - Returns { pnr, status: "cancelled", refund: random amount 100-1000 }
 *
 * Function: getBookingStatus(pnr)
 *   - async function
 *   - Simulates status check with small delay
 *   - Validates pnr: must start with "PNR"
 *   - If invalid: throws Error "Invalid PNR number!"
 *   - Returns { pnr, status: random from ["confirmed", "waitlisted", "cancelled"],
 *     lastUpdated: new Date().toISOString() }
 *
 * Function: bookMultipleTickets(passengers, trainNumber, date, classType)
 *   - async function
 *   - Takes array of passenger objects
 *   - Books for EACH passenger SEQUENTIALLY (await in loop, one by one)
 *   - Returns array of booking results (each is bookTicket result or error object)
 *   - If individual booking fails, catch error and include { passenger, error: message }
 *     in results, continue with next passenger
 *   - Agar passengers array empty, return empty array
 *
 * Function: raceBooking(trainNumbers, passenger, date, classType)
 *   - async function
 *   - Takes array of trainNumbers
 *   - Tries booking on ALL trains in PARALLEL
 *   - Returns first successful booking using Promise.any-like approach
 *   - If all fail, throws Error "Koi bhi train mein seat nahi mili!"
 *   - Hint: use Promise.any or map trainNumbers to bookTicket promises
 *
 * Rules:
 *   - ALL functions must be async
 *   - Use await for sequential operations
 *   - bookMultipleTickets must be sequential (one after another)
 *   - raceBooking must be parallel (all at once)
 *   - Proper error handling with try/catch
 *   - Train number format: exactly 5 digit string
 *   - PNR format: starts with "PNR"
 *
 * @example
 *   const availability = await checkSeatAvailability("12345", "2025-01-15", "3A");
 *   // => { trainNumber: "12345", date: "2025-01-15", classType: "3A",
 *   //      available: true, seats: 35, waitlist: 5 }
 *
 * @example
 *   const booking = await bookTicket(
 *     { name: "Rahul", age: 28, gender: "M" },
 *     "12345", "2025-01-15", "3A"
 *   );
 *   // => { pnr: "PNR483921", passenger: {...}, trainNumber: "12345",
 *   //      date: "2025-01-15", class: "3A", status: "confirmed", fare: 800 }
 *
 * @example
 *   const results = await bookMultipleTickets(
 *     [{ name: "Amit", age: 30, gender: "M" }, { name: "Priya", age: 25, gender: "F" }],
 *     "12345", "2025-01-15", "SL"
 *   );
 *   // => [{ pnr: "PNR...", ...}, { pnr: "PNR...", ...}]
 */
export async function checkSeatAvailability(trainNumber, date, classType) {
  // Your code here
  const validClassType = ["SL", "3A", "2A", "1A"]
  if (typeof trainNumber !== "string" || trainNumber.length !== 5) {
    throw new Error("Invalid train number! 5 digit hona chahiye.")
  }
  if (!validClassType.includes(classType)) {
    throw Error("Invalid class type!")
  }
  if (!date || date.trim() === "") {
    throw Error("Date required hai!")
  }
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  await delay(100)

  const seatRandom = Math.floor(Math.random() * 51)
  const waitlistRandom = Math.floor(Math.random() * 21)

  const isSeatAvaliable = seatRandom > 0

  return {
    trainNumber,
    date,
    classType,
    available: isSeatAvaliable,
    seats: seatRandom,
    waitlist: waitlistRandom
  }
}

export async function bookTicket(passenger, trainNumber, date, classType) {
  // Your code here
  if (!passenger.name || !passenger.age || !passenger.gender) {
    throw Error("Invalid passenger details!")
  }

  const availability = await checkSeatAvailability(trainNumber, date, classType)

  const fares = {
    SL: 250,
    "3A": 800,
    "2A": 1200,
    "1A": 2000
  }

  return {
    pnr: "PNR" + Math.floor(Math.random() * 1000000),
    passenger,
    trainNumber,
    date,
    class: classType,
    status: availability.available ? "confirmed" : "waitlisted",
    fare: fares[classType]
  }
}

export async function cancelTicket(pnr) {
  // Your code here
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  await delay(100)
  
  if (pnr.trim() === "" || !pnr.startsWith("PNR")) throw Error("Invalid PNR number!")

  const refund = Math.floor(Math.random() * (1000 - 100 + 1)) + 100

  return {
    pnr,
    status: "cancelled",
    refund
  }
}

export async function getBookingStatus(pnr) {
  // Your code here
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  await delay(100)

  if (!pnr.startsWith("PNR")) throw Error("Invalid PNR number!")
  
  const validStatus = ["confirmed", "waitlisted", "cancelled"]

  return {
    pnr,
    status: validStatus[ Math.floor(Math.random() * validStatus.length) ],
    lastUpdated: new Date().toISOString()
  }
}

export async function bookMultipleTickets(passengers, trainNumber, date, classType) {
  // Your code here
  if (!passengers.length) return []

  const results = []

  for (let passenger of passengers) {
    try{
      let result = await bookTicket(passenger, trainNumber, date, classType)
      results.push(result)
    } catch(err) {
      results.push({passenger, error: err.message})
    }
  }

  return results
}

export async function raceBooking(trainNumbers, passenger, date, classType) {
  // Your code here
  const promises = trainNumbers.map( train =>
    bookTicket(passenger, train, date, classType)
    .then(result => {
      if (result.status !== "confirmed"){
        throw new Error("Not confirmed")
      }
      return result
    })
  )

  return Promise
  .any(promises)
  .catch(() => {
    throw new Error("Koi bhi train mein seat nahi mili!")
  })
}
