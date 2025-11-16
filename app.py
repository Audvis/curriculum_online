from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, date
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///timesheets.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'

CORS(app)
db = SQLAlchemy(app)

# Models
class Developer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    position = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    avatar_url = db.Column(db.String(500), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    timesheets = db.relationship('Timesheet', backref='developer', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'position': self.position,
            'department': self.department,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat()
        }

class Timesheet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    developer_id = db.Column(db.Integer, db.ForeignKey('developer.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    project_name = db.Column(db.String(200), nullable=False)
    task_description = db.Column(db.Text, nullable=False)
    hours_worked = db.Column(db.Float, nullable=False)
    task_type = db.Column(db.String(50), nullable=False)  # Development, Testing, Meeting, Documentation, etc.
    status = db.Column(db.String(50), default='Completed')  # In Progress, Completed, Blocked
    notes = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'developer_id': self.developer_id,
            'developer_name': self.developer.name if self.developer else '',
            'date': self.date.isoformat(),
            'project_name': self.project_name,
            'task_description': self.task_description,
            'hours_worked': self.hours_worked,
            'task_type': self.task_type,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

# Create tables
with app.app_context():
    db.create_all()

# Routes - Views
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

# API Routes - Developers
@app.route('/api/developers', methods=['GET'])
def get_developers():
    developers = Developer.query.all()
    return jsonify([dev.to_dict() for dev in developers])

@app.route('/api/developers', methods=['POST'])
def create_developer():
    data = request.json
    developer = Developer(
        name=data['name'],
        email=data['email'],
        position=data['position'],
        department=data['department'],
        avatar_url=data.get('avatar_url', '')
    )
    db.session.add(developer)
    db.session.commit()
    return jsonify(developer.to_dict()), 201

@app.route('/api/developers/<int:id>', methods=['GET'])
def get_developer(id):
    developer = Developer.query.get_or_404(id)
    return jsonify(developer.to_dict())

@app.route('/api/developers/<int:id>', methods=['PUT'])
def update_developer(id):
    developer = Developer.query.get_or_404(id)
    data = request.json
    developer.name = data.get('name', developer.name)
    developer.email = data.get('email', developer.email)
    developer.position = data.get('position', developer.position)
    developer.department = data.get('department', developer.department)
    developer.avatar_url = data.get('avatar_url', developer.avatar_url)
    db.session.commit()
    return jsonify(developer.to_dict())

@app.route('/api/developers/<int:id>', methods=['DELETE'])
def delete_developer(id):
    developer = Developer.query.get_or_404(id)
    db.session.delete(developer)
    db.session.commit()
    return jsonify({'message': 'Developer deleted successfully'})

# API Routes - Timesheets
@app.route('/api/timesheets', methods=['GET'])
def get_timesheets():
    developer_id = request.args.get('developer_id')
    if developer_id:
        timesheets = Timesheet.query.filter_by(developer_id=developer_id).order_by(Timesheet.date.desc()).all()
    else:
        timesheets = Timesheet.query.order_by(Timesheet.date.desc()).all()
    return jsonify([ts.to_dict() for ts in timesheets])

@app.route('/api/timesheets', methods=['POST'])
def create_timesheet():
    data = request.json
    timesheet = Timesheet(
        developer_id=data['developer_id'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        project_name=data['project_name'],
        task_description=data['task_description'],
        hours_worked=float(data['hours_worked']),
        task_type=data['task_type'],
        status=data.get('status', 'Completed'),
        notes=data.get('notes', '')
    )
    db.session.add(timesheet)
    db.session.commit()
    return jsonify(timesheet.to_dict()), 201

@app.route('/api/timesheets/<int:id>', methods=['GET'])
def get_timesheet(id):
    timesheet = Timesheet.query.get_or_404(id)
    return jsonify(timesheet.to_dict())

@app.route('/api/timesheets/<int:id>', methods=['PUT'])
def update_timesheet(id):
    timesheet = Timesheet.query.get_or_404(id)
    data = request.json
    if 'developer_id' in data:
        timesheet.developer_id = data['developer_id']
    if 'date' in data:
        timesheet.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    if 'project_name' in data:
        timesheet.project_name = data['project_name']
    if 'task_description' in data:
        timesheet.task_description = data['task_description']
    if 'hours_worked' in data:
        timesheet.hours_worked = float(data['hours_worked'])
    if 'task_type' in data:
        timesheet.task_type = data['task_type']
    if 'status' in data:
        timesheet.status = data['status']
    if 'notes' in data:
        timesheet.notes = data['notes']
    db.session.commit()
    return jsonify(timesheet.to_dict())

@app.route('/api/timesheets/<int:id>', methods=['DELETE'])
def delete_timesheet(id):
    timesheet = Timesheet.query.get_or_404(id)
    db.session.delete(timesheet)
    db.session.commit()
    return jsonify({'message': 'Timesheet entry deleted successfully'})

# API Routes - Statistics
@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    total_developers = Developer.query.count()
    total_hours = db.session.query(db.func.sum(Timesheet.hours_worked)).scalar() or 0
    total_entries = Timesheet.query.count()

    # Hours by task type
    hours_by_type = db.session.query(
        Timesheet.task_type,
        db.func.sum(Timesheet.hours_worked)
    ).group_by(Timesheet.task_type).all()

    # Hours by project
    hours_by_project = db.session.query(
        Timesheet.project_name,
        db.func.sum(Timesheet.hours_worked)
    ).group_by(Timesheet.project_name).all()

    return jsonify({
        'total_developers': total_developers,
        'total_hours': round(total_hours, 2),
        'total_entries': total_entries,
        'hours_by_type': {item[0]: round(item[1], 2) for item in hours_by_type},
        'hours_by_project': {item[0]: round(item[1], 2) for item in hours_by_project}
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
