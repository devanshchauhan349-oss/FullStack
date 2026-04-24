const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-');
        const category = await Category.create({ name, slug });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};