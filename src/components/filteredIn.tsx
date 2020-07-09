import { frontmatter } from "./markdownTypes"

// Answers question: Is this item filtered into view?
const FilteredIn = (comparisonArray: Array<string>, frontmatter: frontmatter): boolean => {
  let skillArray = frontmatter.skillsused.split(", ")
  skillArray = skillArray.concat(frontmatter.skillslearned.split(", "))
  skillArray = skillArray.concat(frontmatter.softskills.split(", "))
  for (let item in skillArray) {
    if (comparisonArray.includes(skillArray[item])) {
      return true
    }
  }
  return false
}

export default FilteredIn