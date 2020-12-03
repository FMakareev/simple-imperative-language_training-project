console.clear();
/**
 * реализация просто абстрактной машины и операционной семантики
 * (правила для абстрактной машины по которым выполняет вычисления)
 *
 * предложение - выражение в результате ведет к новому выражению,
 * результат вычисления предложение это изменение состояния абстрактной машины,
 * состояние этой машины это окружение, простой пример предложения "x = x + 2;".
 *
 * окружение - это список переменных к которым обращается выражение
 * терма - конечное состояние, рузультат программы
 *
 */

// TODO: переделать передачу массива выражение + окружение в класса с поддержкой свертки

export class MNumber {
  value: any;
  constructor(value: any) {
    this.value = value;
  }
  reducible() {
    return false;
  }
}

export class MBoolean {
  value: boolean;
  constructor(value: boolean) {
    this.value = value;
  }
  reducible() {
    return false;
  }
}

export class LessThan {
  leftValue: any;
  rightValue: any;
  constructor(leftValue: any, rightValue: any) {
    this.leftValue = leftValue;
    this.rightValue = rightValue;
  }
  reducible() {
    return true;
  }
  reduce(environment: any) {
    if (this.leftValue.reducible()) {
      return new LessThan(this.leftValue.reduce(environment), this.rightValue);
    } else if (this.rightValue.reducible()) {
      return new LessThan(this.leftValue, this.rightValue.reduce(environment));
    } else {
      return new MBoolean(this.leftValue.value < this.rightValue.value);
    }
  }
}

// Переменная
export class Variable {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  reducible() {
    return true;
  }
  // получение значения переменной по имени из окружения,
  // окружение передается от виртуальной машины и прокидывается во все методы reduce
  reduce(environment: any) {
    return environment[this.name];
  }
}

/** СЛОЖЕНИЕ */
export class MAdd {
  leftValue: any;
  rightValue: any;
  constructor(leftValue: any, rightValue: any) {
    this.leftValue = leftValue;
    this.rightValue = rightValue;
  }
  // проверка вычисляемый ли элемент
  reducible() {
    return true;
  }
  // вычисления
  reduce(environment: any) {
    if (this.leftValue.reducible()) {
      return new MAdd(this.leftValue.reduce(environment), this.rightValue);
    } else if (this.rightValue.reducible()) {
      return new MAdd(this.leftValue, this.rightValue.reduce(environment));
    } else {
      return new MNumber(this.leftValue.value + this.rightValue.value);
    }
  }
}

/** Умножение */
export class Multyply {
  leftValue: any;
  rightValue: any;
  constructor(leftValue: any, rightValue: any) {
    this.leftValue = leftValue;
    this.rightValue = rightValue;
  }
  reducible() {
    return true;
  }
  reduce(environment: any) {
    if (this.leftValue.reducible()) {
      return new Multyply(this.leftValue.reduce(environment), this.rightValue);
    } else if (this.rightValue.reducible()) {
      return new Multyply(this.leftValue, this.rightValue.reduce(environment));
    } else {
      return new MNumber(this.leftValue.value * this.rightValue.value);
    }
  }
}

/**
 * Предложение котрое ничего не делает
 */
export class DoNothing {
  reducible() {
    return false;
  }
}

// ВЫЧИСЛЕНИЕ ПРЕДЛОЖЕНИЙ
export class Assign {
  name: string;
  expression: any;

  constructor(name: string, expression: any) {
    this.name = name;
    this.expression = expression;
  }

  reducible() {
    return true;
  }

  /**
   * @param environment
   * @returns [expression, environment]
   */
  reduce(environment: any): [any, any] {
    if (this.expression.reducible()) {
      return [
        new Assign(this.name, this.expression.reduce(environment)),
        environment
      ];
    } else {
      return [
        new DoNothing(),
        {
          ...environment,
          [this.name]: this.expression
        }
      ];
    }
  }
}

// абстрактная машина
export class Machine {
  expression: any;
  environment: any;

  constructor(expression: any, environment: any) {
    this.expression = expression;
    this.environment = environment;
  }

  run(): any {
    if (this.expression.reducible()) {
      const result = this.expression.reduce(this.environment);
      if (Array.isArray(result)) {
        this.expression = result[0];
        this.environment = result[1];
      } else {
        this.expression = result;
      }

      return this.run();
    } else {
      return [this.expression, this.environment];
    }
  }
}

// -------------------------------------------

console.log(
  new Machine(
    new MAdd(
      new Multyply(new MNumber(1), new MNumber(2)),
      new Multyply(new MNumber(3), new MNumber(4))
    ),
    {}
  ).run()
);
console.log(
  new Machine(
    new LessThan(new MNumber(5), new MAdd(new MNumber(2), new MNumber(2))),
    {}
  ).run()
);

console.log(
  new Machine(new MAdd(new Variable("left"), new Variable("right")), {
    left: new MNumber(2),
    right: new MNumber(2)
  }).run()
);
