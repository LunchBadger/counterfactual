const {deployContract, buildCFContractAddress, waitForDeployEvent} = require('./factory')

const {isContract} = require('./helpers')

const salt = Date.now()
async function wait() {
  const address = await buildCFContractAddress(salt)
  const event = await waitForDeployEvent(address)
  console.log(event)
}

async function main() {
  try {
    const address = await buildCFContractAddress(salt)

    console.log(await isContract(address))

    const result = await deployContract(salt)
    console.log(result.address)

    console.log(await isContract(result.address))
  } catch(err) {
    console.log(err.message)
  }
}

//wait()
main()
