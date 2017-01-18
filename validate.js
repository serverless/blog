const path = require('path')
const yml = require('gray-matter')
const fs = require('markdown-magic').fsExtra
const globby = require('markdown-magic').globby
const authorDirectory = path.join(__dirname, 'authors')
const postsDirectory = path.join(__dirname, 'posts')

// Example shape of author data
const authorData = JSON.parse(fs.readFileSync(path.join(authorDirectory, 'DavidWells.json'), 'utf8'))

// test author directory
globby(['*', '!node_modules'], {
  cwd: authorDirectory
}).then(paths => {
    paths.forEach((file) => {
      const fp = path.join(authorDirectory, file)
      if (file.match(/\.json/)) {
        const author = fs.readFileSync(fp, 'utf8')
        const valid = hasSameProps(authorData, JSON.parse(author))
        if (!valid) {
          const msg = `${file} has missing value in author profile.
Author data must match (if no value applies use false):
${JSON.stringify(authorData, null, 2)}`
          throw new Error(msg)
        }
      } else {
        // not json throw error
        throw new Error(`${file} file type not allowed in authors directory ${file}`);
      }
    })

    return paths.map((file) => {
      return file.replace('.json', '')
    })
}).then((authorNames)=> {
  console.log('authorNames', authorNames)
}).catch((e) => {
  console.log(e)
  process.exit(1)
})

// test post directory
globby(['*', '!node_modules'], {
  cwd: postsDirectory
}).then(paths => {
  console.log(paths);
  paths.forEach((file) => {
    const postPath = path.join(postsDirectory, file)
    if (file.match(/\.md/)) {
      const post = fs.readFileSync(postPath, 'utf8')
      const postData = yml(post).data
      if (isEmptyObject(postData)) {
        // throw new Error(`no yaml found in post! Please update ${file}`)
      }

      if (!postData.title) {
        throw new Error(`no title found in post! Please update ${file}`)
      }
      if (!postData.authors) {
        //throw new Error(`no author found in post! Please update ${file}`)
      }
      if (postData.authors && !Array.isArray(postData.authors)) {
        throw new Error(`Author field is incorrectly formatted.
Please update ${postPath}

---- The correct format is -----

authors:
  - AuthorName
  - OptionalAuthorTwo
`)
      }
      if (!postData.description) {
        // throw new Error(`no description found in post! Please update ${file}`)
      }
      if (!postData.thumbnail) {
        // throw new Error(`no thumbnail found in post! Please update ${file}`)
      }
      if (!postData.date) {
        // throw new Error(`no date found in post! Please update ${file}`)
      }

    } else {
      // not .md throw error
      // throw new Error(`${file} not allowed in posts directory`);
    }
  })
}).catch((e) => {
  console.log(e)
  process.exit(1)
})


/* utils */
function hasSameProps(obj1, obj2) {
  return Object.keys(obj1).every((prop) => {
    return obj2.hasOwnProperty(prop)
  })
}
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
