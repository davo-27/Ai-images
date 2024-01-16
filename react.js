const generateForm = document.querySelector(".generator-form");
const imageGallery = document.querySelector(".image-galley")

const OPENAI_API_KEY = "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"
 

const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject, index)=> {
      const imgCard = imageGallery.querySelectorAll(".img-card")[index]
      const imgElement = imgCard.querySelector("img")
      const downloadBtn = imgCard.querySelector(".download-btn")

      const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`
      imgElement.src = aiGeneratedImg

      imgElement.onload = () =>{
        imgCard.classList.remove("loading")
        downloadBtn.setAttribute("href", aiGeneratedImg)
        downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`)
      }
    });
}


const generateAiImages = async (userPront, userImgQuantity) => {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: userPront,
        n: parseInt(userImgQuantity),
        size: "512x512",
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`API Error: ${errorMessage}`);
    }

    const { data } = await response.json();
    updateImageCard([...data])
    console.log(data);
  } catch (error) {
    alert(error.message);
  }
};


handleFormSubmission = (e)=>{
    e.preventDefault()
    console.log(e.srcElement);

    const userPront = e.srcElement[0].value
    const userImgQuantity = e.srcElement[1].value

 const imgCardMarkup = Array.from({length: userImgQuantity}, ()=>
       `<div class="img-card loading">
       <img src="Spinner-1s-200px.svg" alt="image">
     <a href="#" class="download-btn">
       <img src="bxs-download.svg">
     </a>
     </div>` 
).join("")

imageGallery.innerHTML = imgCardMarkup
generateAiImages(userPront, userImgQuantity)
}

generateForm.addEventListener("submit", handleFormSubmission)
