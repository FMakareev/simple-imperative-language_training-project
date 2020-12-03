import {
  Machine,
  MAdd,
  Multyply,
  MNumber,
  LessThan,
  Variable,
  Assign,
  DoNothing
} from "./index";

test("test", () => {
  expect(
    new Machine(
      new MAdd(
        new Multyply(new MNumber(1), new MNumber(2)),
        new Multyply(new MNumber(3), new MNumber(4))
      ),
      {}
    ).run()[0]
  ).toEqual({
    value: 14
  });
});

test("test 1", () => {
  expect(
    new Machine(
      new LessThan(new MNumber(5), new MAdd(new MNumber(2), new MNumber(2))),
      {}
    ).run()[0]
  ).toEqual({
    value: false
  });
});

test("test 2", () => {
  expect(
    new Machine(new MAdd(new Variable("left"), new Variable("right")), {
      left: new MNumber(2),
      right: new MNumber(2)
    }).run()[0]
  ).toEqual({
    value: 4
  });
});

test("test 3", () => {
  var state = new Assign("x", new MAdd(new Variable("x"), new MNumber(1)));
  var env = {
    x: new MNumber(2)
  };

  expect(state.reducible()).toBeTruthy();

  var [state, env] = state.reduce(env);
  expect(env.x).toEqual({
    value: 2
  });

  var [state, env] = state.reduce(env);
  expect(env.x).toEqual({
    value: 2
  });

  var [state, env] = state.reduce(env);
  expect(state instanceof DoNothing).toBeTruthy();
  expect(env.x).toEqual({
    value: 3
  });
});

test("test 4", () => {
  expect(
    new Machine(new Assign("x", new MAdd(new Variable("x"), new MNumber(1))), {
      x: new MNumber(2)
    }).run()
  ).toMatchObject([
    {},
    {
      x: {
        value: 3
      }
    }
  ]);
});
