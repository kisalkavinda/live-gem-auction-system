Easy fix — this just means the frames folder doesn't exist yet in that location. ffmpeg can't create folders automatically, only files.
You're currently working inside the ffmpeg bin folder itself (C:\Users\Avishka\Downloads\Compressed\ffmpeg-8.1.1-essentials_build\bin), and your video is there too — that's fine, ffmpeg found it. You just need to create the frames subfolder first.
Fix: create the folder, then rerun
In that same Command Prompt window, type:
mkdir frames
Press Enter. Then run your exact same command again:
ffmpeg -i mine-video.mp4 -vf "fps=15,scale=1920:-1" frames/frame_%04d.jpg -q:v 3
This time it should run through to completion instead of erroring out immediately.
One thing to note from your output
Your video is 8 seconds long, not 10 — that's fine, just means you'll get roughly 120 frames instead of 150 (8 sec × 15 fps). When you update the prototype later, set FRAME_COUNT = 120 in the script to match (I'll help you confirm the exact number once you see how many files land in the frames folder).
Also worth knowing for next time: I'd recommend moving your project out of the Downloads\Compressed\ffmpeg-...\bin folder entirely — that's ffmpeg's own installation folder, not a great place to keep your video/frames long-term. Once this works, consider creating a proper gemhaven-video folder on your Desktop, moving mine-video.mp4 there, and running ffmpeg commands from inside that folder instead (ffmpeg works from anywhere once it's on your PATH, you don't need to be inside its bin folder to run it).You said: now i have craeated the frames.