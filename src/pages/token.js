AsyncStorage.getItem('token').then((token) => {
      this.setState({'token': token})
      }).done();