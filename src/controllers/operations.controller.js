import Operation from '../models/operation.model.js';

export const getAllOperation = async (req, res) => {
  const accountId = req.query.accountId
  try {
    const operations = await Operation.find({
      $or: [
        { sendingAccount: accountId },
        { receivingAccount: accountId }
      ]
    })
    res.status(200).json({
      response: true,
      operations: operations
    });
  } catch (err) {
    res.status(400).json({
      error: 400,
      message: err.message || 'Bad Request',
    });
  }
}

