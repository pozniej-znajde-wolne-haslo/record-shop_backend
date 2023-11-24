import RecordModel from '../models/recordSchema.js';

export const getAllRecords = async (req, res, next) => {
  try {
    // without REQ.QUERY ---> u get ALL records
    const records = await RecordModel.find(req.query);

    records.length > 0
      ? res.send({ success: true, data: records })
      : res
          .status(404)
          .send({ success: false, message: 'no such record found' });
  } catch (err) {
    next(err);
  }
};

export const getSingleRecord = async (req, res, next) =>
  // '/api/records/singlerecord/2343gljg345325jg'
  // --GET--
  {
    try {
      const singleRecord = await RecordModel.findById(req.params.id);

      res.send({ success: true, data: singleRecord });
    } catch (err) {
      next(err);
    }
  };

export const createRecord = async (req, res, next) => {
  try {
    const newRecord = await RecordModel.create(req.body);

    res.send({ success: true, data: newRecord });
  } catch (err) {
    next(err);
  }
};

export const updateRecord = async (req, res, next) => {
  // '/api/records/singlerecord/2343gljg345325jg'
  // --PATCH--
  try {
    const record = await RecordModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send({ success: true, data: record });
    // can create condition (if no such ID, send ERROR MSG)
  } catch (err) {
    next(err);
  }
};

export const deleteRecord = async (req, res, next) => {
  // '/api/records/singlerecord/2343gljg345325jg'
  // --DELETE--
  try {
    const deletedRecord = await RecordModel.findByIdAndDelete(req.params.id);

    res.send({ success: true, data: 'record deleted' }); // or (deletedRecord)
  } catch (err) {
    next(err);
  }
};
