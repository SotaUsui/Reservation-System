from app import db                                                        


class Computer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_reserved = db.Column(db.Boolean, unique=False, nullable=False, default=False)

    def __repr__(self):
        return '<Computer %r, %r, %r>' % (self.id, self.user_id, self.is_reserved)

    def serialize(self):
        return {
            'id': self.id,
            'userID': self.user_id,
            'isReserved': self.is_reserved
        }


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(80), unique=False, nullable=False)
    computers = db.relationship('Computer', backref='user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self.username

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
