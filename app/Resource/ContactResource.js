const dayjs = require('dayjs');

module.exports = (contact) => {
    return {
        id: contact.id,
        name: contact.name || '',
        email: contact.email || '',
        message: contact.message || '',
        createdAt: contact.createdAt ? dayjs(contact.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
    };
};