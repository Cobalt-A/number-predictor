
if (window.location.host == 'www.paribet.ru') {
	console.log('INIT');
	wait()
}

function wait() {
	if (document.querySelector('.ev-header__caption--1nhET')) {
		console.log('predict 1.0')

		async function fetchTotal() {
			const path = document.location.pathname.split('/')
			const id = path[path.length-2]
			if (path.length == 6 && path[2] == 'basketball') {
				const request = await fetch(`https://line06.pb06e2-resources.com/line/liveEventInfo/?lang=ru&sysId=1&eventId=${id}`)

				const response = await request.json()
				return response
			}
		}


		function getHtml(array) {
			const html = `<div class="row-common--33mLE predict-felement"><div class="cell-wrap--LHnTw"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z">Вычесленный тотал для ${array[2]} четверти = ${array[0]}</div></div></div><div class="cell-wrap--LHnTw _separator--3ypyv"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z"></div></div></div><div class="cell-wrap--LHnTw"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z">Вычесленный тотал всей игры = ${array[1]}</div></div></div></div>`
			return html
		}


		function predict(ftime, falltotal, fmathtotal, match, isNBA) {

			// time calculating in minutes
			const passedTime = Number(ftime)/60
			const allMatchTime = isNBA ? 13 : 10
			const allTime = allMatchTime * 4
			const matchTime = match === 1 ? Number(passedTime) : Number(passedTime) - (Number(match)-1) * Number(allMatchTime)
			const leftMatchTime = Number(match) * Number(allMatchTime) - Number(passedTime)

			// average goals per minute
			const average = Number(falltotal) / Number(passedTime)
			const matchAverage = matchTime > 2 ? Number(fmathtotal)/Number(matchTime) : average

			// final result
			const matchPredict = matchTime > 2 ? Number(matchAverage) * Number(allMatchTime) : Number(fmathtotal) + Number(matchAverage) * Number(leftMatchTime)
			const predict = match == 4 ? (falltotal - fmathtotal) + matchPredict : Number(average) * Number(allTime)

			console.log(matchPredict, predict);
			return [Number(matchPredict), Number(predict), match]
		}


		function apendHtml(fpredict) {
			const elements = document.querySelectorAll('.text-new--2WAqa')

			for (let i = 0; i<elements.length; i++) {
				const text = elements[i].innerText
				if (text.includes('Тотал') && !elements[i].parentNode.parentNode.classList.contains('_collapsed--4j2qR')) {
					const target = elements[i].parentNode.parentNode.parentNode.lastChild.firstChild.firstChild

					if (target.lastChild.lastChild.innerText.includes('Вычесленный')) {
						target.lastChild.firstChild.innerText = `Вычесленный тотал для ${fpredict[2]} четверти = ${fpredict[0]}`
						target.lastChild.lastChild.innerText = `Вычесленный тотал всей игры = ${fpredict[1]}`
					} else {
						const html = getHtml(fpredict)
						target.innerHTML += html
					}
				}
			}
		}



		setInterval(() => {
			const path = document.location.pathname.split('/')
			if (path.length == 6 && path[2] == 'basketball') {
				let isNBA = false
				if (document.querySelectorAll('.ev-header__caption--1nhET')[2]) {
					isNBA = document.querySelectorAll('.ev-header__caption--1nhET')[2].innerText.includes('NBA')
				}

				fetchTotal().then(resp => {
					if (resp.timerSeconds && resp.scores) {
						const ftime = resp.timerSeconds ? resp.timerSeconds : console.error('uncorect response from server');
						const match = resp.scores[1] ? resp.scores[1].length : 1

						const falltotal = resp.scores[0] ? Number(resp.scores[0][0].c1) + Number(resp.scores[0][0].c2) : console.error('uncorect response from server');
						const fmatchtotal = match == 1 ? Number(resp.scores[0][0].c1) + Number(resp.scores[0][0].c2) : Number(resp.scores[1][resp.scores[1].length-1].c1) + Number(resp.scores[1][resp.scores[1].length-1].c2)
			
						const fpredict = predict(ftime, falltotal, fmatchtotal, match, isNBA)
						apendHtml(fpredict)
					}
				})
			}
		}, 1000)


	} else {
		console.log('wait')
		setTimeout(function() {wait()}, 3000)
	}
}
