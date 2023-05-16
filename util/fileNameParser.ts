export const getDivisionName = (postTitle: string) => {
    const splitString = postTitle.split(', ')
    //splits into array to get division name, for example: [ 'Solita Ninja vs Solita Herkku', 'Challengers', '1.5.2023' ]
    const postTitleDivisionName = splitString[1]
    return postTitleDivisionName
}