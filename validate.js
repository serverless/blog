const path = require('path')
const yml = require('gray-matter')
const fs = require('markdown-magic').fsExtra
const globby = require('markdown-magic').globby
const authorDirectory = path.join(__dirname, 'authors')
const postsDirectory = path.join(__dirname, 'posts')
const dateFormatRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])-/g

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
  // console.log('authorNames', authorNames)
}).catch((e) => {
  console.log(e)
  process.exit(1)
})

// test post directory
globby(['*', '!node_modules'], {
  cwd: postsDirectory
}).then(paths => {
  // console.log(paths);
  paths.forEach((file) => {
    const postPath = path.join(postsDirectory, file)
    if (file.match(dateFormatRegex)) {
      const post = fs.readFileSync(postPath, 'utf8')
      const postData = yml(post).data
      let msg
      if (isEmptyObject(postData)) {
        msg = `no yaml found in post! Please update ${file}`
        throw new Error(msg)
      }

      if (!postData.title) {
msg = `No title found in post YAML

Please update ${file}

---- The description format is -----

title: "My 50-60 character Human & Keyword Friendly title"

${seperator}
`
        throw new Error(msg)
      }
      if (!postData.authors) {
msg = `no author found in post! Please update ${file}

---- Author format is -----

authors:
  - Serverless

${seperator}
`
        throw new Error(msg)
      }
      if (postData.authors && !Array.isArray(postData.authors)) {
msg = `Author field is incorrectly formatted as a string.

Please update ${file}

---- The correct format is -----

authors:
  - AuthorName
  - OptionalAuthorTwo

${seperator}
`
        throw new Error(msg)
      }
      if (postData.description && postData.description.length > 185) {
msg = `Description in ${file} is too long.

It is ${postData.description.length} characters long

Please update keep descriptions under 185 characters long
${seperator}
`
        throw new Error(msg)
      }
      if (!postData.description) {
msg = `No description found in post YAML

Please update ${file}

---- The description format is -----

description: "My 155-170 character long description for SEO purposes"

${seperator}
`
        throw new Error(msg)
      }
      if (!postData.thumbnail) {
        // throw new Error(`no thumbnail found in post! Please update ${file}`)
      }
      if (!postData.date) {
        throw new Error(`no date found in post! Please update ${file}`)
      }

    }
    // Only allow markdown files in directory
    if(!file.match(/\.md/)) {
msg = `${file} type not allowed in posts directory

Please remove ${file}

Only markdown files are allow in this directory.

Please upload all images to github or s3

${seperator}
`
      throw new Error(msg);
    }
  })
}).catch((e) => {
  console.log(e)
  process.exit(1)
})


var seperator = '-----------------------------------------'
/* utils */
function hasSameProps(obj1, obj2) {
  return Object.keys(obj1).every((prop) => {
    return obj2.hasOwnProperty(prop)
  })
}
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
