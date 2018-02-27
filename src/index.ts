#! /usr/bin/env node

import * as eyes from 'eyes'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as shell from 'shelljs'

const CONFIG = { find: `x1Bc`, replace: `n\\n` }
const ROOTS = {
	local: (shell.exec('npm root', { async: false, silent: true }).stdout as string).trim(),
	global: (shell.exec('npm root -g', { async: false, silent: true }).stdout as string).trim(),
}

function fixFile(name: string, which: string) {
	console.log(which.toUpperCase(), '->', name + '.js')
	let file = path.resolve(ROOTS[which], 'typescript/lib', name + '.js')
	return fs.readFile(file).then(function(buffer) {
		let data = buffer.toString()
		// // let regex = new RegExp(CONFIG.find, 'g')
		// console.log('\nBEFORE >>>>\n\n', data)
		// console.log('data >')
		// eyes.inspect(data)
		// console.log('data', JSON.stringify(data, null, 4))
		// let find = CONFIG.find
		// // let find = `(\"\\x1Bc\");`
		// console.log('\nFIND >>>>', find, '\n')
		// console.log('find >')
		// eyes.inspect(find)
		// console.log('find', JSON.stringify(find, null, 4))
		let regex = new RegExp(CONFIG.find, 'g')
		data = data.replace(regex, CONFIG.replace)
		// console.log('\nAFTER >>>>\n\n', data)
		return fs.writeFile(file, data)
	})
}

function eachFile(name: string) {
	// console.log('LOCAL ->', name + '.js', '-> replacing all occurrences of', `"${CONFIG.find}"`, 'with', `"${CONFIG.replace}"`)
	// console.log('GLOBAL ->', name + '.js')
	return Promise.all([
		fixFile(name, 'local'),
		fixFile(name, 'global'),
		// fixFile(path.resolve(groot, 'typescript/lib', name + '.js')),
	])
}

console.log(`tsc-wtf -> replacing all occurrences of "${CONFIG.find}" with "${CONFIG.replace}" for these files ->`)

Promise.all([
	eachFile('tsc'),
	eachFile('tsserver'),
	eachFile('tsserverlibrary'),
	eachFile('typescript'),
	eachFile('typescriptServices'),
	eachFile('typingsInstaller'),
]).then(() => console.log('DONE =]'))




// import * as shell from 'shelljs'

// const CONFIG = { find: `x1Bc`, replace: `t` }

// let lroot = (shell.exec('npm root', { async: false, silent: true }).stdout as string).trim()
// let groot = (shell.exec('npm root -g', { async: false, silent: true }).stdout as string).trim()

// function doit(file) {
// 	let lcmd = `gsed -i s/${CONFIG.find}/${CONFIG.replace}/ ${lroot}/typescript/lib/${file}.js`
// 	console.log('LOCAL  >', `${file}.js`) // , lcmd)
// 	shell.exec(lcmd, { async: false, silent: true })
// 	let gcmd = `gsed -i s/${CONFIG.find}/${CONFIG.replace}/ ${groot}/typescript/lib/${file}.js`
// 	console.log('GLOBAL >', `${file}.js`) // , gcmd)
// 	shell.exec(gcmd, { async: false, silent: true })
// }

// console.log('FIXING...')

// doit('tsc')
// doit('tsserver')
// doit('tsserverlibrary')
// doit('typescript')
// doit('typescriptServices')
// doit('typingsInstaller')

// console.log('DONE!')

