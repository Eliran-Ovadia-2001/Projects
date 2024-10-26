"use strict";

$(() => {

    const detailFetched = {};

    fetchData();
    handleMoreInfoClick();
    handleSearch();
    handleCheckboxToggle();

    $("a.nav-link").on("click", function () {

        $("a.nav-link").removeClass("active");
        $(this).addClass("active");

        const sectionId = $(this).attr("data-section");
        $("section").hide();
        $("#" + sectionId).show();

    });

    $("#homeLink").on("click", () => fetchData());
    $("#reportsLink").on("click", () => { });
    $("#aboutLink").on("click", () => showAboutMe());

    function fetchData() {
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd",
            success: function(data) {
                createCards(data);
            }
        });
    }

    function createCards(data) {
        $.each(data, function(index, coin) {
            const cardHtml = createCardHtml(index, coin);
            $('#cryptoCards').append(cardHtml);
            detailFetched[coin.id] = false;
        });
    }

    function createCardHtml(index, coin) {
        return `
            <div class="col-lg-4 col-md-6 mb-4 cryptoCard">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${coin.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${coin.symbol.toUpperCase()}</h6>
                        <div class="form-check form-switch">
                            <input class="form-check-input ${coin.name.replaceAll(' ','-')}-switch" type="checkbox" role="switch" id="flexSwitchCheckChecked">
                            <label class="form-check-label" for="flexSwitchCheckChecked${index}">toggle to check</label>
                        </div>
                        <button class="btn btn-primary more-info-btn" data-id="${coin.id}" data-toggle="collapse" data-target="#collapse-${index}">More Info</button>
                        <div class="collapse mt-3" id="collapse-${index}">
                            <div class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div class="currency-info mt-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function handleMoreInfoClick() {
        $(document).on('click', '.more-info-btn', function() {
            const id = $(this).data('id');
            const collapseTarget = $(this).data('target');
            const currencyInfoDiv = $(collapseTarget).find('.currency-info');

            if (detailFetched[id]) {
                currencyInfoDiv.show();
                return;
            }

            fetchDetailedData(id, collapseTarget, currencyInfoDiv);
        });
    }

    function fetchDetailedData(id, collapseTarget, currencyInfoDiv) {
        $.ajax({
            url: `https://api.coingecko.com/api/v3/coins/${id}`,
            success: function(data) {
                detailFetched[id] = true;
                $(collapseTarget).find('.spinner-border').hide();
                updateCurrencyInfo(currencyInfoDiv, data);
            }
        });
    }

    function updateCurrencyInfo(currencyInfoDiv, data) {
        currencyInfoDiv.html(`
            <img src="${data.image.small}" alt="${data.name}" class="coin-image">
            <p>Price (USD): $${data.market_data.current_price.usd}</p>
            <p>Price (EUR): €${data.market_data.current_price.eur}</p>
            <p>Price (ILS): ₪${data.market_data.current_price.ils}</p>
        `);
        currencyInfoDiv.show();
    }

    function handleSearch() {
        $('#searchInput').keyup(function() {
            const searchText = $(this).val().toLowerCase();
            $('.cryptoCard').each(function() {
                const cardName = $(this).find('.card-title').text().toLowerCase();
                if (cardName.includes(searchText)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    }

    function showAboutMe() {
        document.getElementById("aboutMePage").innerHTML = `
    <div class="text">
        <p>Hello my name is: Eliran Ovadia, And I'm the manufactor of this website,</p>
        <p>Explore a comprehensive application that provides detailed information about digital currencies.</p>
        <p>Track currency prices in dollars, euros, and shekels in real-time. Customize your experience by adding up to 5 coins to the live data chart.</p>
        <p>For any inquiries, feel free to reach out to me at: eliranovadia1936@gmail.com.</p>
        <p>Enjoy tracking and stay updated!</p>
        <img id="image" src="assets/eliran.jpg">
    </div>
        `
    }

    function handleCheckboxToggle() {
        document.addEventListener('change', function(event) {
            if (event.target.classList.contains('form-check-input')) {
                let checkedCount = 0
                const checkboxes = document.querySelectorAll('.form-check-input')
                const card = event.target.closest('.cryptoCard');
                const cardTitle = card.querySelector('.card-title').textContent;
                const isChecked = event.target.checked;
        
                checkboxes.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        checkedCount++;
                    }
                });
        
                if (isChecked) {
                    checkedCount++
                    if (checkedCount > 6) {
                        let selectedCoins = getSelectedCoins();
                        const modalBody = document.getElementById('modal-body');
                        modalBody.innerHTML = `You can only choose 5, diselect one option: <br> ${selectedCoins}`;
                        $('#myModal').modal('show');
                        $('body').block
                        $('#myModal').modal({
                            backdrop: 'static',
                            keyboard: false
                        });                        
                        event.target.checked = true;
                    }
                } else {
                    removeCoinFromLocalStorage(cardTitle);
                }
        
                if (isChecked) {
                    saveCoinToLocalStorage(cardTitle);
                } else {
                    removeCoinFromLocalStorage(cardTitle);
                }
            }
        });
} 


    function getSelectedCoins() {
        const selectedCoins = [];
        $('.form-check-input:checked').each(function() {
            let coinName = $(this).closest('.cryptoCard').find('.card-title').text();
            coinName = coinName.replaceAll(' ','-')
            selectedCoins.push(`<li style="margin-left:10px;margin-right:10px"> <input type="checkbox" onclick="{closeModal('${coinName}')}" checked="true" id="${coinName}"> ${coinName}</li>`);
        });
        return selectedCoins.join('');
    }

    
    function saveCoinToLocalStorage(coinName) {
        const savedCoins = JSON.parse(localStorage.getItem('savedCoins')) || [];
        if (!savedCoins.includes(coinName)) {
            savedCoins.push(coinName);
            localStorage.setItem('savedCoins', JSON.stringify(savedCoins));
        }
    }
    
    function removeCoinFromLocalStorage(coinName) {
        const savedCoins = JSON.parse(localStorage.getItem('savedCoins')) || [];
        const index = savedCoins.indexOf(coinName);
        if (index !== -1) {
            savedCoins.splice(index, 1);
            localStorage.setItem('savedCoins', JSON.stringify(savedCoins));
        }
    }
})



function closeModal(coin) {
    const coinSwitch = '.' + coin.replaceAll(' ','-') + '-switch'
    document.querySelector(coinSwitch).checked = false;
    let myArray = JSON.parse(localStorage.getItem('savedCoins'))
    myArray = myArray.filter(item => item !== coin);
    localStorage.setItem('savedCoins', JSON.stringify(myArray));
    $('#myModal').modal('hide'); 
}   
