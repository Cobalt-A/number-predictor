
if (window.location.host == 'www.paribet.ru') {
	console.log('INIT');
	wait()
}

function wait() {
	if (document.querySelector('.ev-header__caption--1nhET')) {
		console.log('predict 1.0')

		const isNBA = document.querySelectorAll('.ev-header__caption--1nhET')[2].innerText.includes('NBA')

		async function fetchTotal() {
			const path = document.location.pathname.split('/')
			const id = path[path.length-2]
			const request = await fetch(`https://line06.pb06e2-resources.com/line/liveEventInfo/?lang=ru&sysId=1&eventId=${id}`)

			const response = await request.json()
			return response
		}


		function getHtml(array) {
			const html = `<div class="row-common--33mLE"><div class="cell-wrap--LHnTw"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z">Вычесленный тотал для идущего матча =&nbsp;${array[0]}</div></div></div><div class="cell-wrap--LHnTw _separator--3ypyv"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z"></div></div></div><div class="cell-wrap--LHnTw"><div class="cell-align-wrap--1FzAV _align-left--5DczK"><div class="common-text--2QJ6z">Вычесленный тотал всей игры =&nbsp;${array[1]}</div></div></div></div>`
			return html
		}


		function predict(ftime, falltotal, fmathtotal, match) {
			const minutes = ftime.indexOf(':') == 1 ? ftime.slice(0, 1) : ftime.slice(0, 2)
			const seconds = ftime.indexOf(':') == 1 ? ftime.slice(2) : ftime.slice(3)
			const passedTime = Number(minutes) + Number(seconds)/60
			const allMatchTime = isNBA ? 13 : 10
			const allTime = allMatchTime * 4
			const matchTime = match === 1 ? Number(passedTime) : Number(passedTime) - (Number(match)-1)*Number(allMatchTime)
			const lastTime = Number(match) * Number(allMatchTime) - Number(passedTime)

			const localAverageMin = fmathtotal && matchTime ? Number(fmathtotal)/Number(matchTime) : Number(falltotal)/Number(passedTime)
			const averageMin = Number(falltotal)/Number(passedTime)
			const localPredict = Number(fmathtotal) + Number(localAverageMin) * Number(lastTime)
			const predict = Number(averageMin) * Number(allTime)

			console.log(localPredict, predict);
			return [Number(localPredict), Number(predict)]
		}


		function apendHtml(fpredict) {
			const elements = document.querySelectorAll('.text-new--2WAqa')

			for (let i = 0; i<elements.length; i++) {
				const text = elements[i].innerText
				if (text.includes('Тотал')) {
					const target = elements[i].parentNode.parentNode.parentNode.lastChild.firstChild.firstChild

					if (target.lastChild.lastChild.innerText.includes('Вычесленный')) {
						target.lastChild.firstChild.innerText = `Вычесленный тотал для идущего матча = ${fpredict[0]}`
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
			if (path.length != 6 && path[2] != 'basketball') { return }

			fetchTotal().then(resp => {
				const ftime = resp.timer
				const falltotalArray = resp.scores[0]
				const fmathtotalArray = resp.scores[1]
				const falltotal = Number(resp.scores[0][0].c1) + Number(resp.scores[0][0].c2)
				const fmathtotal = Number(fmathtotalArray[fmathtotalArray.length-1].c1) + Number(fmathtotalArray[fmathtotalArray.length-1].c2)
	
				const match = fmathtotalArray.length
	
				const fpredict = predict(ftime, falltotal, fmathtotal, match)
				apendHtml(fpredict)
			})
		}, 1000)


	} else {
		console.log('wait')
		setTimeout(function() {wait()}, 3000)
	}
}
