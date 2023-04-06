export const transformStringToDate = (date: string) => {
  const datetime = new Date(date)

  const dateWithThreeHours = new Date(
    datetime.setHours(datetime.getHours() + 3),
  )

  return dateWithThreeHours
}
