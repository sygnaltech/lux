
/*
 * Page | Home
 */

import { IRouteHandler, Page } from "@sygnal/sse";
import posthog from "posthog-js";
 

export class ServicesPage implements IRouteHandler {

  constructor() {
  }

  setup() {

    Page.loadEngineCSS("services.css");     

  }

  exec() {

console.log("services page"); 

    this.installVideoPopup(); 

  }

  // Function to handle MP4 link clicks and video pop-up
  installVideoPopup() {
    // const videoPopup = document.getElementById('videoPopup') as HTMLElement;
    // const videoElement = document.getElementById('popupVideo') as HTMLVideoElement;
    // const closePopup = document.getElementById('closePopup') as HTMLElement;
    console.log("install video")

    // Create pop-up elements
    const { videoPopup, videoElement, closeButton } = this.createVideoPopupElements();

    // Handle click on MP4 links
    document.querySelectorAll<HTMLAnchorElement>('a[href$=".mp4"]').forEach((link) => {
        link.addEventListener('click', (event: Event) => {
            event.preventDefault(); // Prevent the default action

            // Log PostHog event  
            posthog.capture("media-popup", {
              media: "3d4d" 
            });   

            const videoUrl = link.href; // Get the video URL from the link

            // Set the video source to the clicked link's URL
            videoElement.src = videoUrl;

            // Show the pop-up and play the video
            videoPopup.style.display = 'flex';
            videoElement.play();
        });
    });

    // Close the pop-up when the close button is clicked
    closeButton.addEventListener('click', () => {
        videoPopup.style.display = 'none'; // Hide the pop-up
        videoElement.pause(); // Pause the video
        videoElement.src = ''; // Reset the video source
    });

    // Close the pop-up when clicking outside the video
    videoPopup.addEventListener('click', (event: MouseEvent) => {
        if (event.target === videoPopup) {
            videoPopup.style.display = 'none';
            videoElement.pause();
            videoElement.src = ''; // Reset the video source
        }
    });
  }

  createVideoPopupElements() {

console.log("creating elements")


    // Create the overlay (pop-up) container
    const videoPopup = document.createElement('div');
    videoPopup.id = 'videoPopup';
    videoPopup.className = 'popup-overlay';
    
    // Create the content container
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';

    // Create the close button
    const closeButton = document.createElement('span');
    closeButton.id = 'closePopup';
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';

    // Create the video element
    const videoElement = document.createElement('video');
    videoElement.id = 'popupVideo';
    videoElement.style.width = '100%';
    videoElement.controls = true;
    
    // Append the video and close button to the content container
    popupContent.appendChild(closeButton);
    popupContent.appendChild(videoElement);
    
    // Append the content container to the overlay
    videoPopup.appendChild(popupContent);
    
    // Append the pop-up to the body
    document.body.appendChild(videoPopup);

    // Return the key elements for further use
    return {
        videoPopup,
        videoElement,
        closeButton
    };
}



}
