# backend-challenge-graphql
Backend Challenge Graphql

instalar dependencias

yarn ou npm install

Para executar o projeto

yarn dev

Fazer a busca por planetas

query SuitablePlanets {
    suitablePlanets {
        name
        mass
        hasStation
    }
}

Fazer a busca por estações

query Stations {
  stations {
    id
    name
  }
}

Fazer a busca por estação pelo id

query StationById {
  stationById(id: "") {
    id
    name
  }
}

Fazer a busca por instalações

query Installations {
  installations {
    id
    planet
    station {
      id
      name
    }
  }
}

Fazer a busca por estação pelo id

query InstallationById {
  installationById(id: "") {
    id
    planet
    station {
      id
      name
    }
  }
}

Criar estação

mutation CreateStation {
  createStation(input: {
    name: ""
  }){
    name
  }
}

alterar dados da estação

mutation UpdateStation {
  updateStation(id: "", input: {
    name: "JEOVA"
  }) {
    name
  }
}

deletar estação

mutation DeleteStation {
  deleteStation(id: "") {
    planet
  }
}

Criar instalação

mutation CreateInstallation {
  createInstallation(input: {
    planet: ""
    stationId: ""
  }){
    planet
  }
}

Alterar dados da instalação

mutation UpdateInstallation {
  updateInstallation(id: "", input: {
    planet: ""
    stationId: ""
  }) {
    planet
  }
}

Deletar Instalação

mutation DeleteInstallation {
  deleteInstallation(id: "") {
    planet
  }
}
