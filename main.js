let allPhones = [];
let currentIndex = 0;
const itemsPerLoad = 8;

function handleSearch() {
  const searchInputElement = document.getElementById("searchInput");
  const searchError = document.getElementById("search_error");
  const searchInputValue = searchInputElement.value.trim();
  if (searchInputValue === "") {
    searchError.style.display = "block";
    return;
  }
  searchError.style.display = "none";
  document.getElementById("search-loader").style.display = "block";
  loadPhone(searchInputValue);
}

const loadPhone = async (searchText) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phones?search=${searchText}`
    );
    const serverData = await res.json();
    allPhones = serverData.data || [];
    currentIndex = 0;
    const productsGrid = document.getElementById("productsGrid");
    const searchLoader = document.getElementById("search-loader");
    productsGrid.innerHTML = "";
    if (allPhones.length === 0) {
      searchLoader.style.display = "none";
      productsGrid.innerHTML = `
        <div class="no-phone-found">
          <h2>No Phones Found</h2>
          <p>Sorry, we couldn't find any phones matching your search. Try another keyword.</p>
        </div>
      `;
      document.getElementById("loadMoreBtn").style.display = "none";
      return;
    }

    displayPhone();
    toggleLoadMoreButton();
  } catch (error) {
    document.getElementById("search-loader").style.display = "none";
  }
};

const displayPhone = () => {
  const productsGrid = document.getElementById("productsGrid");
  const searchLoader = document.getElementById("search-loader");
  const phonesToShow = allPhones.slice(currentIndex, currentIndex + itemsPerLoad);

  phonesToShow.forEach((phone) => {
    const card = `
      <div class="product-card reveal">
        <div class="card-img">
          <img src="${phone.image}" alt="${phone.phone_name}">
        </div>
        <div class="card-body">
          <div class="card-brand">${phone.brand}</div>
          <h3 class="card-name">${phone.phone_name}</h3>
          <p class="card-desc">
            48MP Pro camera system with ProRAW support, 6.7" Super Retina XDR display with ProMotion.
          </p>
          <div class="card-footer">
            <div class="card-price">
              <span>Starting at</span>
              $999
            </div>
            <button class="btn-card" onclick="loadPhoneDetails('${phone.slug}')">Details</button>
          </div>
        </div>
      </div>
    `;
    productsGrid.insertAdjacentHTML("beforeend", card);
  });

  currentIndex += itemsPerLoad;
  searchLoader.style.display = "none";
  toggleLoadMoreButton();
};

const toggleLoadMoreButton = () => {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.style.display = currentIndex >= allPhones.length ? "none" : "block";
};

const loadPhoneDetails = async (slug) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phone/apple_iphone_13_mini-11104'`
    );
    const data = await res.json();
    showPhoneDetails(data.data);
  } catch (error) {}
};

const showPhoneDetails = (phone) => {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `
    <div class="view_modal_content">
      <h2>${phone.name}</h2>
      <div class="image"><img src="${phone.image}" alt="${phone.name}"></div>
      <p><strong>Brand:</strong> ${phone.brand || "Not Available"}</p>
      <p><strong>Release Date:</strong> ${phone.releaseDate || "Not Available"}</p>
      <p><strong>Chipset:</strong> ${phone.mainFeatures?.chipSet || "Not Available"}</p>
      <p><strong>Display:</strong> ${phone.mainFeatures?.displaySize || "Not Available"}</p>
      <p><strong>Memory:</strong> ${phone.mainFeatures?.memory || "Not Available"}</p>
      <p><strong>Storage:</strong> ${phone.mainFeatures?.storage || "Not Available"}</p>
    </div>
  `;
  document.getElementById("phoneModal").style.display = "flex";
};

function closeModal() {
  document.getElementById("phoneModal").style.display = "none";
}

function handleLoadMore() {
  displayPhone();
}

loadPhone("iphone");