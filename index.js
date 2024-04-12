document.addEventListener('DOMContentLoaded', () => {
  // Declare variables for buttons
  const profile = document.querySelector(".getProfile"); // button in the intro
  const profileContainer = document.querySelector(".container");  //in form fill
  const myContainer = document.querySelector("#profileContainer"); //div with profiles
  const theProfiles = document.querySelector("#theProfiles");  //ul with the profiles
  const submitButton = document.getElementById('btnProfile');

  // The form is partially hidden
  let addProfile = false;
  profile.addEventListener("click", () => {
      addProfile = !addProfile;
      if (addProfile) {
          profileContainer.style.display = "block";
      } else {
          profileContainer.style.display = "none";
      }
  });

  // Fetch data from API
  fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => {
          // Process the data
          data.forEach(item => {
              // Create a card element
              const card = document.createElement('div');
              card.classList.add('card', 'col-md-4', 'my-3');

              // Create card body
              const cardBody = document.createElement('div');
              cardBody.classList.add('card-body');

              // Add data to card body
              cardBody.innerHTML = `
              <h5 class="card-title">${item.name}</h5>
              <img src="${item.image}" class="card-img-top" alt="Profile Image">
              <p class="card-text">Email: ${item.email}</p>
              <p class="card-text">Position: ${item.position}</p>
              <p class="card-text">City: ${item.city}</p>
              <p class="card-text">Qualifications: ${item.qualifications}</p>
              <button class="btn btn-primary contact-button">Contact Me</button>
              <br>
              <br>
              <button class="btn btn-info update-button">Update Info</button> 
              <br>
              <br>
              <button class="btn btn-danger delete-button">Delete</button> 
              `;

              // Append card body to card
              card.appendChild(cardBody);

              // Append card to container
              theProfiles.appendChild(card);

              // Attach event listeners to the update button, delete button, and contact button
              let updateButton = card.querySelector('.update-button');
              let deleteButton = card.querySelector('.delete-button');
              let contactButton = card.querySelector('.contact-button');

              contactButton.addEventListener('click', function () {
                  alert(`${item.name} has been notified!`);
              });


              //DELETE

              deleteButton.addEventListener('click', function () {
                  // Send a DELETE request to the server
                  fetch(`http://localhost:3000/users/${item.id}`, {
                      method: 'DELETE',
                  })
                      .then(response => {
                          if (!response.ok) {
                              throw new Error('Network response was not ok');
                          }
                          return response.json();
                      })
                      .then(data => {
                        // Handle response from the server
                        console.log('Server response:', data);
                        // Remove the card from the DOM
                        card.remove();
                        alert("Are you sure you want to delete this item?")
                        alert(`${item.name} has been deleted`)
                      })
                      .catch(error => {
                          // Handle errors
                          console.error('Error sending delete request to server:', error);
                      });
              });

                //UPDATES THE CARDS

              updateButton.addEventListener('click', function () {
                  // Populate form fields with existing profile data
                  document.getElementById('inputName').value = item.name;
                  document.getElementById('inputEmail').value = item.email;
                  document.getElementById('inputPosition').value = item.position;
                  document.getElementById('inputImage').value = item.image;
                  document.getElementById('inputState').value = item.city;
                  document.getElementById('Qual').value = item.qualifications;

                  // Show the form
                  profileContainer.style.display = "block";

                  // Change the text of the submit button to "Update Profile"
                  submitButton.textContent = "Update Profile";

                  // Add event listener to the submit button of the form
                  const updateProfile = function(event) {
                      event.preventDefault(); // Prevent default form submission behavior

                      // Get updated form values
                      let updatedName = document.getElementById('inputName').value;
                      let updatedEmail = document.getElementById('inputEmail').value;
                      let updatedPosition = document.getElementById('inputPosition').value;
                      let updatedImage = document.getElementById('inputImage').value;
                      let updatedCity = document.getElementById('inputState').value;
                      let updatedQualifications = document.getElementById('Qual').value;

                      // Create an object to hold the updated data
                      let updatedData = {
                          name: updatedName,
                          email: updatedEmail,
                          position: updatedPosition,
                          image: updatedImage,
                          city: updatedCity,
                          qualifications: updatedQualifications
                      };

                      // Send a PUT request to the server to update the profile data
                      fetch(`http://localhost:3000/users/${item.id}`, {
                          method: 'PUT',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(updatedData)
                      })
                          .then(response => {
                              if (!response.ok) {
                                  throw new Error('Network response was not ok');
                              }
                              return response.json();
                          })
                          .then(data => {
                              // Handle response from the server
                              console.log('Server response:', data);
                              // Update the existing card with the updated data
                              cardBody.querySelector('.card-title').textContent = updatedName;
                              // Update other fields similarly
                              alert("Card updated successfully")
                          })
                          .catch(error => {
                              // Handle errors
                              console.error('Error sending data to server:', error);
                          });

                      // Remove event listener after submitting the form
                      submitButton.removeEventListener('click', updateProfile);

                      // Reset the text of the submit button to "Create Profile"
                      submitButton.textContent = "Create Profile";
                  };

                  submitButton.addEventListener('click', updateProfile);
              });
          });
      })
      .catch(error => {
          console.error('Error fetching profiles:', error);
      });




  // Display form contents and send POST request
  submitButton.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default form submission behavior

      // Get form values
      let name = document.getElementById('inputName').value;
      let email = document.getElementById('inputEmail').value;
      let position = document.getElementById('inputPosition').value;
      let image = document.getElementById('inputImage').value;
      let city = document.getElementById('inputState').value;
      let qualifications = document.getElementById('Qual').value;

      // Create an object to hold the form data
      let formData = {
          name: name,
          email: email,
          position: position,
          image: image,
          city: city,
          qualifications: qualifications
      };

      // Log form data to console
      console.log(formData);


      //POST


      // Determine whether to send a POST or PUT request based on the text of the submit button
      //if (submitButton.textContent === "Create Profile") {
          // Send a POST request to the server
          fetch('http://localhost:3000/users', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData)
          })
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response.json();
              })
              .then(data => {
                  // Handle response from the server
                  console.log('Server response:', data);
                  // displayProfile(formData);
                  alert("Profile created!")
              })
              .catch(error => {
                  // Handle errors
                  console.error('Error sending data to server:', error);
              });
})})


  ;






  //carousel


  const slideshowContainer = document.getElementById('carouselExampleAutoplaying');
    const carouselInner = slideshowContainer.querySelector('.carousel-inner');

    // Fetch data from the API
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(data => {
            // Process the data and create carousel item elements
            data.forEach((item, index) => {
                const carouselItem = createCarouselItem(item);
                if (index === 0) {
                    carouselItem.classList.add('active'); // Set first carousel item as active
                }
                carouselInner.appendChild(carouselItem);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Function to create a carousel item element
    function createCarouselItem(item) {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        carouselItem.innerHTML = `
            <img src="${item.image}" class="d-block w-100" alt="${item.name}">
            <div class="carousel-caption d-none d-md-block">
            <h5>${item.name}</h5>
            <p>${item.position}</p>
        </div>
        `;
        return carouselItem;
    }



