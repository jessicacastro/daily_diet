interface Meal {
  id: string
  name: string
  description: string
  datetime: string
  inDiet: boolean
  userId: string
}

export const checkBestSequenceOfMeals = (meals: Meal[]): Meal[] => {
  const sortedMeals = meals.sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  )

  let bestSequenceOfDays: Meal[] = []
  let currentSequenceOfDays: Meal[] = [sortedMeals[0]]

  for (let i = 1; i < sortedMeals.length; i++) {
    const currentMeal = sortedMeals[i]
    const previousMeal = sortedMeals[i - 1]

    // Check if the current meal and the previous meal are consecutive days
    const currentDay = new Date(currentMeal.datetime).getDay()
    const previousDay = new Date(previousMeal.datetime).getDay()
    const daysDiff = currentDay - previousDay

    if (daysDiff === 1) {
      // The current meal is part of the current sequence
      currentSequenceOfDays.push(currentMeal)
    } else {
      // The current meal is not part of the current sequence, start a new one
      if (currentSequenceOfDays.length > bestSequenceOfDays.length) {
        // The current sequence is better than the best sequence so far
        bestSequenceOfDays = currentSequenceOfDays
      }
      currentSequenceOfDays = [currentMeal]
    }
  }

  if (currentSequenceOfDays.length > bestSequenceOfDays.length) {
    bestSequenceOfDays = currentSequenceOfDays
  }

  return bestSequenceOfDays
}
