
if (window.location.host == 'www.paribet.ru') {
	console.log('INIT');
	wait()
}

function wait() {
	if (document.querySelector('.grid--6A7cH')) {
		console.log('predict 1.0')

		let time = document.querySelector('.ev-live-time__timer--6XZjl').innerHTML
		let match = document.querySelectorAll('.ev-score-table__container--6AMHc').length ? document.querySelectorAll('.ev-score-table__container--6AMHc').length : 1
		let localTotal = 0
		let allTotal = 0
		let isAppend = false
		const isNBA = document.querySelectorAll('.ev-header__caption--1nhET')[2].innerText.includes('NBA')

		// Select the node that will be observed for mutations
		const targetNode = document.querySelector('.ev-live-time__timer--6XZjl')

		// Options for the observer (which mutations to observe)
		const config = { attributes: true, childList: true, subtree: true, characterData: true };

		// Callback function to execute when mutations are observed
		const callback = function(mutationsList, observer) {
			console.log('callback');
			getTotal()
			apendHtml()
		};

		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);

		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);


		function getTotal() {
			localTotal = 0
			allTotal = 0
			if (match != 1) {
				const columns = document.querySelectorAll('.ev-score-table__container--6AMHc')
				for (let i = 0; i<match; i++) {
					let lines = columns[i].childNodes
					for(let j = 0; j<2; j++) {
						allTotal += Number(lines[j].innerText)
						if (i === (match-1)) { localTotal += Number(lines[j].innerText) }
					}
				}
			} else {
				const elements = document.querySelectorAll('.ev-score--4dG0A._main--1NGLZ')
				for (let i = 0; i < elements.length; i++) {
					localTotal += Number(elements[i].innerText)
				}
				allTotal = localTotal
			}
		}


		function getHtml() {
			const array = predict()
			let html = `<div class="row-common--33mLE"><div class="cell-wrap--LHnTw"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z">Вычесленный тотал для идущего матча =&nbsp;${array[0]}</div></div></div><div class="cell-wrap--LHnTw _separator--3ypyv"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z"></div></div></div><div class="cell-wrap--LHnTw"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z">Вычесленный тотал всей игры =&nbsp;${array[1]}</div></div></div></div>`
			return html
		}


		function predict() {
			let minutes = time.slice(0, 2)
			let seconds = time.slice(3)
			let passedTime = Number(minutes) + Number(seconds)/60
			let allMatchTime = isNBA ? 13 : 10
			let allTime = allMatchTime * 4
			let matchTime = match === 1 ? Number(passedTime) : Number(passedTime) - (Number(match)-1)*Number(allMatchTime)
			let lastTime = Number(match) * Number(allMatchTime) - Number(passedTime)

			let localAverageMin = localTotal || matchTime ? Number(localTotal)/Number(matchTime) : Number(allTotal)/Number(passedTime)
			let averageMin = Number(allTotal)/Number(passedTime)
			let localPredict = Number(localTotal) + Number(localAverageMin) * Number(lastTime)
			let predict = match === 4 ? Number(allTotal) + Number(localAverageMin) * Number(lastTime) : Number(averageMin) * Number(allTime) //Number(averageMin) * (Number(allTime) - Number(passedTime)) + Number(localPredict)

			console.log(predict, localPredict);
			return [Math.round(Number(localPredict)*100)/100, Math.round(Number(predict)*100)/100]
		}


		function apendHtml() {
			const elements = document.querySelectorAll('.text-new--2WAqa')

			if (!isAppend) {
				for (let i = 0; i<elements.length; i++) {
					let text = elements[i].innerText
					if (text.includes('Тотал')) {
						let html = getHtml()
						let target = elements[i].parentNode.parentNode.parentNode.lastChild.firstChild.firstChild
						target.innerHTML += html
					}
				}
				isAppend = true
			} else {
				for (let i = 0; i<elements.length; i++) {
					let text = elements[i].innerText
					if (text.includes('Тотал')) {
						let target = elements[i].parentNode.parentNode.parentNode.lastChild.firstChild.firstChild
						const array = predict()
						target.lastChild.firstChild.innerText = `Вычесленный тотал для идущего матча = ${array[0]}`
						target.lastChild.lastChild.innerText = `Вычесленный тотал всей игры = ${array[1]}`
					}
				}
			}
		}


		getTotal()
		apendHtml()


	} else {
		console.log('wait')
		setTimeout(function() {wait()}, 3000)
	}
}
