const Travel = require('../models/Travels');

const postTravel = async (req, res) => {
    const { 
        travelOrigin,
        travelDestiny,
        travelSuccess
    } = req.body;

    const travel = new Travel({
        travelOrigin,
        travelDestiny,
        travelSuccess
    });

    try {
        const travelsaved = await travel.save();
        return res.status(200).json({ 
            message: 'Viagem salva com sucesso!',
            data: { travel: travelsaved }
        });
    } catch (error) {
        return res.status(400).json({ 
            message: 'Houve um problema ao salvar a viagem.',
            errorMessage: error
        });
    }
};

const getAllTravel = async (req, res) => {
    try {
        const travels = await Travel.find();     
        return res.status(200).json({ 
            message: 'Viagens recuperadas com sucesso! ',
            data: { travel: travels }
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Houve um problema ao recuperar as viagens.',
            errorMessage: error
        });
    }
};

module.exports = { postTravel, getAllTravel };