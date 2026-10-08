from flask import Flask, request, jsonify
from api_output import get_scholarship_data

app = Flask(__name__)


@app.route("/search", methods=["POST"])
def search():
    student = request.get_json()

    if not student:
        return jsonify({
            "error": "Student data is required"
        }), 400

    try:
        scholarships = get_scholarship_data(student)

        return jsonify({
            "success": True,
            "count": len(scholarships),
            "scholarships": scholarships
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "MeritMap SerpApi Service is running"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)