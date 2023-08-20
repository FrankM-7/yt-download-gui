from youtubesearchpython import VideosSearch
import yt_dlp as youtube_dl
import json

output_json = {}
output_json["results"] = []

# init VideosSearch object
ydl_opts = {}
videosSearch = VideosSearch("ojitos lindos", limit = 5)

# build the url
youtube_link = "https://www.youtube.com/watch?v="
for result in videosSearch.result()['result']:
    newlink = youtube_link + result["id"]

    newResult = {}
    newResult["title"] = result["title"]
    newResult["link"] = newlink
    newResult["videos"] = []

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

print(json.dumps(output_json, indent=4))