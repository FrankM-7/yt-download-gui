import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import yt_dlp as youtube_dl
from youtubesearchpython import VideosSearch
import os

app = Flask(__name__)
app_config = {"host": "0.0.0.0", "port": sys.argv[1]}

"""
---------------------- DEVELOPER MODE CONFIG -----------------------
"""
# Developer mode uses app.py
if "app.py" in sys.argv[0]:
  # Update app config
  app_config["debug"] = True

  # CORS settings
  cors = CORS(
    app,
    resources={r"/*": {"origins": "http://localhost*"}},
  )

  # CORS headers
  app.config["CORS_HEADERS"] = "Content-Type"


"""
--------------------------- REST CALLS -----------------------------
"""
# Remove and replace with your own
@app.route("/example")
def example():

  # See /src/components/App.js for frontend call
  return jsonify("Example response from Flask! Learn more in /app.py & /src/components/App.js")

@app.route("/search", methods=["GET"])
def search():
  query = request.args.get("query")
  
  output_json = {}
  output_json["results"] = []

  # init VideosSearch object
  ydl_opts = {}
  videosSearch = VideosSearch(query, limit = 2)
  results = videosSearch.result()["result"]
  # build the url
  youtube_link = "https://www.youtube.com/watch?v="
  for result in results:
      newlink = youtube_link + result["id"]

      newResult = {}
      newResult["title"] = result["title"]
      newResult["link"] = newlink
      newResult["videos"] = []
      # get thumbnail with the highest resolution
      newResult["thumbnail"] = result["thumbnails"][0]["url"]
      newResult["duration"] = result["duration"]

      output_json["results"].append(newResult)
      continue

      with youtube_dl.YoutubeDL(ydl_opts) as ydl:
          meta = ydl.extract_info(newlink, download=False)
          formats = meta.get('formats', [meta])
          print(result["title"])
          for format in formats:
              try:
                  # audio channels == 2 means theres audio, video_ext != none means theres video
                  if (format['audio_channels'] == 2 and format['video_ext'] != 'none'):
                      print(format['url'])
                      newResult["videos"].append(format['url'])
                      # print(format['width'], format['height'])
                      # print(format['tbr'])
                      # print()
              except:
                  continue

      output_json["results"].append(newResult)
  response = jsonify(output_json)
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response


@app.route("/download", methods=["GET"])
def download():
  link = request.args.get("url")
  # output to desktop
  # get user desktop path
  desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
  ydl_opts = {
    'outtmpl': desktop + '/Musica' +  '/%(title)s.%(ext)s',
  }

  # uncomment this for Mac developing and comment the above code desktop and ydl_opts
  # ydl_opts = {
  # }
  with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download([link])
  response = jsonify("Downloaded")
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response
"""
-------------------------- APP SERVICES ----------------------------
"""
# Quits Flask on Electron exit
@app.route("/quit")
def quit():
  shutdown = request.environ.get("werkzeug.server.shutdown")
  shutdown()

  return


if __name__ == "__main__":
  app.run(**app_config)