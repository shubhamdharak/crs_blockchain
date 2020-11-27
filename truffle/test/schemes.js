const Schemes = artifacts.require("Schemes");

contract('Scheme deployement', ()=> {
    it('Try to get it', async ()=> {
        const schemes = await Schemes.deployed()
        .then(result => {
            
            console.log(result.methods.getScheme)
        });
    });
});