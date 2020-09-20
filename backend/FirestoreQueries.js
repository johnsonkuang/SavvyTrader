

// further implementation of asynchronous parts of firestore queries
exports.addToCollection = async function (data, db, col) {
  const queryRef = db.collection(col);
  const result = await queryRef.add(data);
  return result;
}
exports.addToCollectionWithID = async function (data, db, col, id) {
  const queryRef = db.collection(col);
  const result = await queryRef.doc(id).set(data);
  return result;
}
exports.setUserEnergy = async function (user, newEnergy, db, col) {
  const queryRef = db.collection(col).doc(user);
  const result = await queryRef.update({energy: newEnergy});
  return result;
}
exports.setUserPoints = async function (user, newPoints, db, col) {
  const queryRef = db.collection(col).doc(user);
  const result = await queryRef.update({points: newPoints});
  return result;
}
exports.getUserInfo = async function (user, db, col) {
  const queryRef = db.collection(col).doc(user);
  const resultRef = await queryRef.get();
  if (!resultRef.exists) {
    return null;
  }
  return resultRef.data();
}
exports.getUsersPredictions = async function (user, db, col) {
  const queryRef = db.collection(col);
  const resultRef = await queryRef.where('trader', '==', user).orderBy('dateResult', 'desc').get();
  return resultRef.docs.map(doc => doc.data());
}
exports.getLeaderBoard = async function (db, col) {
  const queryRef = db.collection(col);
  const resultRef = await queryRef.orderBy("points", 'desc').limit(10).get();
  const arrayRes = resultRef.docs.map(doc => ({
    name: doc.id,
    points: doc.data().points
  }));
  return arrayRes;
}
