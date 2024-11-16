from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for, session
from PIL import Image
import io
import base64
import numpy as np
import os
from functools import wraps

# Get the absolute path of the current file's directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Create the Flask app with explicit template and static folders
app = Flask(__name__, 
            template_folder=os.path.join(current_dir, 'templates'),
            static_folder=os.path.join(current_dir, 'static'))

app.secret_key = 'your_secret_key_here'  # Change this to a secure random key

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        # In a real application, you would validate against a database
        if email == 'user@example.com' and password == 'password':
            session['logged_in'] = True
            return redirect(url_for('app_page'))
        else:
            return 'Invalid credentials', 401
    return render_template('login.html')

@app.route('/signup', methods=['POST'])
def signup():
    # Here you would typically handle user registration
    # For this example, we'll just return a success message
    data = request.json
    # In a real application, you would save this data to a database
    print(f"Received signup request for: {data['email']}")
    return jsonify({'message': 'Signup successful'}), 200

@app.route('/app')
@login_required
def app_page():
    return render_template('app.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))

@app.route('/api/segment', methods=['POST'])
@login_required
def segment_image():
    try:
        data = request.json
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        segmented_image = mock_segment_image(image)
        buffered = io.BytesIO()
        segmented_image.save(buffered, format="PNG")
        segmented_image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        return jsonify({'segmentedImage': f'data:image/png;base64,{segmented_image_base64}'})
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'error': 'Error processing image'}), 500

def mock_segment_image(image):
    """
    This is a mock segmentation function.
    In a real scenario, you would implement actual image segmentation here.
    """
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    mask = np.zeros((height, width), dtype=np.uint8)
    np.fill_diagonal(mask, 255)
    segmented = img_array.copy()
    segmented[mask == 0] = [0, 0, 0]
    return Image.fromarray(segmented)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)